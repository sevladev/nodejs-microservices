import { BaseCommand } from "./base-command";
import { IUserRepository } from "../repositories/user-repository/user-repository-types";
import { UserEntity } from "../entities/user-entity";
import { hash } from "bcryptjs";

interface Request {
  email: string;
  password: string;
  phone: string;
  name: string;
}

export class CreateUserCommand extends BaseCommand {
  constructor(private userRepository: IUserRepository) {
    super();
  }

  async execute({ email, name, password, phone }: Request) {
    try {
      const checkIfEmailAlreadyRegistered =
        await this.userRepository.findByEmail(email.toLowerCase(), {
          _id: 1,
          password: 1,
        });

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

      return { ...user, password: null };
    } catch (error) {
      return this.handleException(error);
    }
  }
}
