import { ObjectId } from "mongodb";
import { UserTokenEntity } from "../../entities/user-token-entity";
import { ProjectionType } from "../../commons/constants";

export interface IUserTokenRepository {
  createOrUpdate(payload: UserTokenEntity): Promise<void>;
  countAll(): Promise<number>;
  findByUserId(
    user_id: ObjectId,
    projection?: ProjectionType<UserTokenEntity>
  ): Promise<UserTokenEntity | undefined | null>;
  findById(
    _id: ObjectId,
    projection?: ProjectionType<UserTokenEntity>
  ): Promise<UserTokenEntity | undefined | null>;
  deleteToken(refresh_token: ObjectId): Promise<void>;
  updateExpiresToken(refresh_token: ObjectId, tstamp: number): Promise<void>;
}
