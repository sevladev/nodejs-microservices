import { Collection, Db } from "mongodb";
import { IUserRepository } from "./user-repository-types";
import { collections } from "../../infra/mongo-db";
import { UserEntity } from "../../entities/user-entity";
import { ProjectionType } from "../../commons/constants";

export class UserRepositoryImplementation implements IUserRepository {
  private usersDb: Collection;

  constructor(db: Db) {
    this.usersDb = db.collection(collections.users);
  }

  async create(payload: UserEntity): Promise<void> {
    try {
      await this.usersDb.insertOne(payload);
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(
    email: string,
    projection?: ProjectionType<UserEntity>
  ): Promise<UserEntity | undefined | null> {
    try {
      const result = await this.usersDb.findOne<UserEntity>(
        {
          email: new RegExp(email, "i"),
        },
        { projection }
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
}
