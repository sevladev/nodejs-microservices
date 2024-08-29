import { Db } from "mongodb";
import { UserTokenRepositoryInMemory } from "./user-token-repository-in-memory";
import { UserTokenRepositoryImplementation } from "./user-token-repository-implementation";

export const getUserTokenRepositories = (db: Db) => {
  if (process.env.NODE_ENV === "test") {
    return new UserTokenRepositoryInMemory();
  } else {
    return new UserTokenRepositoryImplementation(db);
  }
};
