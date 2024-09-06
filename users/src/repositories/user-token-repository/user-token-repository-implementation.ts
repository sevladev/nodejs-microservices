import { Collection, Db, ObjectId } from "mongodb";
import { collections } from "../../infra/mongo-db";
import { IUserTokenRepository } from "./user-token-repository-types";
import { UserTokenEntity } from "../../entities/user-token-entity";
import { ProjectionType } from "../../commons/constants";

export class UserTokenRepositoryImplementation implements IUserTokenRepository {
  private usersTokensDb: Collection;

  constructor(db: Db) {
    this.usersTokensDb = db.collection(collections.users_tokens);
  }

  async findById(
    _id: ObjectId,
    projection?: ProjectionType<UserTokenEntity>
  ): Promise<UserTokenEntity | undefined | null> {
    try {
      const result = await this.usersTokensDb.findOne<UserTokenEntity>(
        { _id },
        { projection }
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async createOrUpdate(payload: UserTokenEntity): Promise<void> {
    try {
      await this.usersTokensDb.deleteOne({ user_id: payload.user_id });
      await this.usersTokensDb.insertOne(payload);
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

  async findByUserId(
    user_id: ObjectId,
    projection?: ProjectionType<UserTokenEntity>
  ): Promise<UserTokenEntity | undefined | null> {
    try {
      const result = await this.usersTokensDb.findOne<UserTokenEntity>(
        { user_id },
        { projection }
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteToken(refresh_token: ObjectId): Promise<void> {
    try {
      await this.usersTokensDb.deleteOne({ _id: refresh_token });
    } catch (error) {
      throw error;
    }
  }

  async updateExpiresToken(
    refresh_token: ObjectId,
    tstamp: number
  ): Promise<void> {
    try {
      await this.usersTokensDb.updateOne(
        { _id: refresh_token },
        { $set: { expires_at: tstamp } }
      );
    } catch (error) {
      throw error;
    }
  }
}
