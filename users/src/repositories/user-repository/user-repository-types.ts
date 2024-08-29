import { ObjectId } from "mongodb";
import { ProjectionType } from "../../commons/constants";
import { UserEntity } from "../../entities/user-entity";

export interface IUserRepository {
  create(payload: UserEntity): Promise<void>;
  findByEmail(
    email: string,
    projection?: ProjectionType<UserEntity>
  ): Promise<UserEntity | undefined | null>;
  findById(
    _id: ObjectId,
    projection?: ProjectionType<UserEntity>
  ): Promise<UserEntity | undefined | null>;
}
