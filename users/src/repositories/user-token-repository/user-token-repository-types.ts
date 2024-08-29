import { UserTokenEntity } from "../../entities/user-token-entity";

export interface IUserTokenRepository {
  createOrUpdate(payload: UserTokenEntity): Promise<void>;
  countAll(): Promise<number>;
}
