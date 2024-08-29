import { UserEntity } from "../../entities/user-entity";
import { IUserRepository } from "./user-repository-types";

export class UserRepositoryInMemory implements IUserRepository {
  private users: UserEntity[] = [];

  async create(payload: UserEntity): Promise<void> {
    this.users.push(payload);
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.users.find((f) => new RegExp(f.email, "i").test(email));
  }
}
