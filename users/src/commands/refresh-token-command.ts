import { BaseCommand } from "./base-command";
import { IUserTokenRepository } from "../repositories/user-token-repository/user-token-repository-types";
import { jwtConfig } from "../config/jwt";
import { UserTokenEntity } from "../entities/user-token-entity";
import moment from "moment";
import { ObjectId } from "mongodb";
import { sign } from "jsonwebtoken";
import { IRedisProvider } from "../providers/redis/redis-types";
import { IUserRepository } from "../repositories/user-repository/user-repository-types";

interface Request {
  refresh_token: string;
}

export class RefreshTokenCommand extends BaseCommand {
  constructor(
    private userTokenRepository: IUserTokenRepository,
    private userRepository: IUserRepository,
    private redisProvider: IRedisProvider
  ) {
    super();
  }

  async execute({ refresh_token }: Request) {
    try {
      const old_refresh_token = new ObjectId(refresh_token);

      const getToken = await this.userTokenRepository.findById(
        old_refresh_token
      );

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

      const user = await this.userRepository.findById(getToken.user_id);

      await this.redisProvider.set(
        `auth-token-${getToken.user_id}`,
        JSON.stringify({
          token: new_token,
          role: user?.role,
          is_active: user?.is_active,
        }),
        3600
      );

      return {
        token: new_token,
        refresh_token: new_refresh_token._id,
      };
    } catch (error) {
      return this.handleException(error);
    }
  }
}
