import { ObjectId } from "mongodb";
import { BaseEntity } from "./base-entity";

export class UserTokenEntity extends BaseEntity {
  user_id: ObjectId;

  expires_at: number;

  constructor({
    expires_at,
    user_id,
  }: Omit<UserTokenEntity, "created_at" | "updated_at" | "_id">) {
    super();

    this.expires_at = expires_at;
    this.user_id = user_id;
  }
}
