import { BaseCommand } from "./base-command";
import { IUserRepository } from "../repositories/user-repository/user-repository-types";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";

interface Request {
  email: string;
  password: string;
}

export class CreateSessionCommand extends BaseCommand {
  constructor(private userRepository: IUserRepository) {
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

      return {
        token,
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
