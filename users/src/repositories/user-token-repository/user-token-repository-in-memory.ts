import { UserTokenEntity } from "../../entities/user-token-entity";
import { IUserTokenRepository } from "./user-token-repository-types";

export class UserTokenRepositoryInMemory implements IUserTokenRepository {
  private users_tokens: UserTokenEntity[] = [];

  async createOrUpdate(payload: UserTokenEntity): Promise<void> {
    const findIndex = this.users_tokens.findIndex((f) =>
      f.user_id.equals(payload.user_id)
    );

    if (findIndex < 0) {
      this.users_tokens.push(payload);
    } else {
      this.users_tokens[findIndex] = payload;
    }
  }

  async countAll(): Promise<number> {
    return this.users_tokens.length;
  }
}
