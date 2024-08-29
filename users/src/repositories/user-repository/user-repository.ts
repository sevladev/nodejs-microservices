import { Db } from "mongodb";
import { UserRepositoryImplementation } from "./user-repository-implementation";
import { UserRepositoryInMemory } from "./user-repository-in-memory";

export const getUserRepositories = (db: Db) => {
  if (process.env.NODE_ENV === "test") {
    return new UserRepositoryInMemory();
  } else {
    return new UserRepositoryImplementation(db);
  }
};
