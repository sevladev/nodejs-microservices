import { BaseCommand } from "./base-command";
import { IUserRepository } from "../repositories/user-repository/user-repository-types";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { IUserTokenRepository } from "../repositories/user-token-repository/user-token-repository-types";
import { UserTokenEntity } from "../entities/user-token-entity";
import moment from "moment";
import { IRedisProvider } from "../providers/redis/redis-types";

interface Request {
  email: string;
  password: string;
}

export class CreateSessionCommand extends BaseCommand {
  constructor(
    private userRepository: IUserRepository,
    private userTokenRepository: IUserTokenRepository,
    private redisProvider: IRedisProvider
  ) {
    super();
  }

  async execute({ email, password }: Request) {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        return this.addError("invalid credentials");
      }

      const checkPassoword = await compare(password, user.password);

      if (!checkPassoword) {
        return this.addError("invalid credentials");
      }

      const token = sign(
        { _id: user?._id },
        process.env.PRIVATE_KEY as string,
        { expiresIn: jwtConfig.expiresIn }
      );

      const refresh_token = new UserTokenEntity({
        expires_at: moment().add(7, "days").unix(),
        user_id: user._id,
      });

      await this.userTokenRepository.createOrUpdate(refresh_token);

      await this.redisProvider.set(
        `auth-token-${user._id}`,
        JSON.stringify({ token, role: user.role, is_active: user.is_active }),
        3600
      );

      return {
        token,
        refresh_token: refresh_token._id,
        user: {
          ...user,
          password: null,
        },
      };
    } catch (error) {
      return this.handleException(error);
    }
  }
}
