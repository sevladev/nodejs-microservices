import { ObjectId } from "mongodb";
import { UserTokenEntity } from "../../entities/user-token-entity";
import { IUserTokenRepository } from "./user-token-repository-types";

const users_tokens: UserTokenEntity[] = [];

export class UserTokenRepositoryInMemory implements IUserTokenRepository {
  async createOrUpdate(payload: UserTokenEntity): Promise<void> {
    const findIndex = users_tokens.findIndex((f) =>
      f.user_id.equals(payload.user_id)
    );

    if (findIndex < 0) {
      users_tokens.push(payload);
    } else {
      users_tokens[findIndex] = payload;
    }
  }

  async countAll(): Promise<number> {
    return users_tokens.length;
  }

  async findByUserId(
    user_id: ObjectId
  ): Promise<UserTokenEntity | undefined | null> {
    return users_tokens.find((f) => f.user_id.equals(user_id));
  }
  async deleteToken(refresh_token: ObjectId): Promise<void> {
    const index = users_tokens.findIndex((f) => f._id.equals(refresh_token));

    if (index > -1) {
      users_tokens.splice(index, 1);
    }
  }

  async updateExpiresToken(
    refresh_token: ObjectId,
    tstamp: number
  ): Promise<void> {
    const findIndex = users_tokens.findIndex((f) =>
      f._id.equals(refresh_token)
    );

    if (findIndex > -1) {
      users_tokens[findIndex].expires_at = tstamp;
    }
  }
}
