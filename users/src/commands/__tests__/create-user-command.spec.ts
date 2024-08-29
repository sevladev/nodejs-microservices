import "../../infra/env";

import { UserRepositoryInMemory } from "../../repositories/user-repository/user-repository-in-memory";
import { IUserRepository } from "../../repositories/user-repository/user-repository-types";
import { UserTokenRepositoryInMemory } from "../../repositories/user-token-repository/user-token-repository-in-memory";
import { IUserTokenRepository } from "../../repositories/user-token-repository/user-token-repository-types";
import { CreateUserCommand } from "../create-user-command";
describe("create-user-command", () => {
  let userRepository: IUserRepository;
  let userTokenRepository: IUserTokenRepository;
  let createUserCommand: CreateUserCommand;

  beforeAll(() => {
    userRepository = new UserRepositoryInMemory();
    userTokenRepository = new UserTokenRepositoryInMemory();
    createUserCommand = new CreateUserCommand(
      userRepository,
      userTokenRepository
    );
  });

  it("should be able to create a new user and return itself without password", async () => {
    const request = {
      email: "test@example.com",
      password: "password123",
      phone: "123456789",
      name: "Test User",
    };

    const result = await createUserCommand.execute(request);

    expect(result).toHaveProperty("user");
    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("refresh_token");
  });

  it("should be not able to create a user with exists email", async () => {
    const request = {
      email: "test@example.com",
      password: "password123",
      phone: "123456789",
      name: "Test User",
    };

    const result = await createUserCommand.execute(request);

    expect(result).toBe(false);
  });
});
