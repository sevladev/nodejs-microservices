import { UserRepositoryImplementation } from "./user-repository-implementation";
import { UserRepositoryInMemory } from "./user-repository-in-memory";

export const userRepositories = {
  test: UserRepositoryInMemory,
  dev: UserRepositoryImplementation,
  prod: UserRepositoryImplementation,
};
