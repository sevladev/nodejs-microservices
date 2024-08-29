import { BaseCommand } from "./base-command";
import { IUserRepository } from "../repositories/user-repository/user-repository-types";
import { ObjectId } from "mongodb";

interface Request {
  requester_id: string;
}

export class UserGetMeCommand extends BaseCommand {
  constructor(private userRepository: IUserRepository) {
    super();
  }

  async execute({ requester_id }: Request) {
    try {
      const user_id = new ObjectId(requester_id);

      const user = await this.userRepository.findById(user_id);

      return {
        ...user,
        password: null,
      };
    } catch (error) {
      return this.handleException(error);
    }
  }
}
