import { ObjectId } from "mongodb";
import { UserEntity } from "../../entities/user-entity";
import { IUserRepository } from "./user-repository-types";

const users: UserEntity[] = [];

export class UserRepositoryInMemory implements IUserRepository {
  async create(payload: UserEntity): Promise<void> {
    users.push(payload);
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return users.find((f) => new RegExp(f.email, "i").test(email));
  }
  async findById(_id: ObjectId): Promise<UserEntity | undefined | null> {
    return users.find((f) => f._id.equals(_id));
  }
}
