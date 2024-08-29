import { Collection, Db } from "mongodb";
import { collections } from "../../infra/mongo-db";
import { IUserTokenRepository } from "./user-token-repository-types";
import { UserTokenEntity } from "../../entities/user-token-entity";

export class UserTokenRepositoryImplementation implements IUserTokenRepository {
  private usersTokensDb: Collection;

  constructor(db: Db) {
    this.usersTokensDb = db.collection(collections.users_tokens);
  }

  async createOrUpdate(payload: UserTokenEntity): Promise<void> {
    try {
      await this.usersTokensDb.updateOne(
        { user_id: payload.user_id },
        { $set: payload },
        { upsert: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async countAll(): Promise<number> {
    try {
      const result = await this.usersTokensDb.countDocuments();
      return result;
    } catch (error) {
      throw error;
    }
  }
}
