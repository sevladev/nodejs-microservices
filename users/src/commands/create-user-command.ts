import { BaseCommand } from "./base-command";
import { IUserRepository } from "../repositories/user-repository/user-repository-types";
import { UserEntity } from "../entities/user-entity";
import { hash } from "bcryptjs";
import { jwtConfig } from "../config/jwt";
import { sign } from "jsonwebtoken";
import { IUserTokenRepository } from "../repositories/user-token-repository/user-token-repository-types";
import { UserTokenEntity } from "../entities/user-token-entity";
import moment from "moment";
import { IRedisProvider } from "../providers/redis/redis-types";

interface Request {
  email: string;
  password: string;
  phone: string;
  name: string;
}

export class CreateUserCommand extends BaseCommand {
  constructor(
    private userRepository: IUserRepository,
    private userTokenRepository: IUserTokenRepository,
    private redisProvider: IRedisProvider
  ) {
    super();
  }

  async execute({ email, name, password, phone }: Request) {
    try {
      const checkIfEmailAlreadyRegistered =
        await this.userRepository.findByEmail(email.toLowerCase());

      if (checkIfEmailAlreadyRegistered) {
        return this.addError("email already registered");
      }

      const hashedPassword = await hash(password, 8);

      const user = new UserEntity({
        email,
        name,
        password: hashedPassword,
        phone,
      });

      await this.userRepository.create(user);

      const token = sign(
        { _id: String(user._id) },
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
        user: { ...user, password: null },
        token,
        refresh_token: refresh_token._id,
      };
    } catch (error) {
      return this.handleException(error);
    }
  }
}
