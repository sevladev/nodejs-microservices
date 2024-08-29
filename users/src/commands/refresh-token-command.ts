import { BaseCommand } from "./base-command";
import { IUserTokenRepository } from "../repositories/user-token-repository/user-token-repository-types";
import { jwtConfig } from "../config/jwt";
import { UserTokenEntity } from "../entities/user-token-entity";
import moment from "moment";
import { ObjectId } from "mongodb";
import { sign } from "jsonwebtoken";

interface Request {
  refresh_token: string;
  requester_id: string;
}

export class RefreshTokenCommand extends BaseCommand {
  constructor(private userTokenRepository: IUserTokenRepository) {
    super();
  }

  async execute({ refresh_token, requester_id }: Request) {
    try {
      const user_id = new ObjectId(requester_id);
      const old_refresh_token = new ObjectId(refresh_token);

      const getToken = await this.userTokenRepository.findByUserId(user_id);

      if (!getToken) {
        return this.addError("refresh token not found");
      }

      if (moment().unix() > getToken.expires_at) {
        await this.userTokenRepository.deleteToken(old_refresh_token);
        return this.addError("refresh token expired");
      }

      if (!old_refresh_token.equals(getToken._id)) {
        await this.userTokenRepository.deleteToken(old_refresh_token);
        return this.addError("invalid refresh token");
      }

      const new_token = sign(
        { _id: String(getToken?.user_id) },
        process.env.PRIVATE_KEY as string,
        { expiresIn: jwtConfig.expiresIn }
      );

      const new_refresh_token = new UserTokenEntity({
        expires_at: moment().add(7, "days").unix(),
        user_id: new ObjectId(getToken?.user_id),
      });

      await this.userTokenRepository.createOrUpdate(new_refresh_token);

      return {
        token: new_token,
        refresh_token: new_refresh_token._id,
      };
    } catch (error) {
      return this.handleException(error);
    }
  }
}
