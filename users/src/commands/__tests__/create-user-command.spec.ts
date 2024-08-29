import "../../infra/env";

import { UserRepositoryInMemory } from "../../repositories/user-repository/user-repository-in-memory";
import { IUserRepository } from "../../repositories/user-repository/user-repository-types";
import { CreateUserCommand } from "../create-user-command";
describe("create-user-command", () => {
  let userRepository: IUserRepository;
  let createUserCommand: CreateUserCommand;
  let db = null as any;

  beforeAll(() => {
    userRepository = new UserRepositoryInMemory(db);
    createUserCommand = new CreateUserCommand(userRepository);
  });

  it("should be able to create a new user and return itself without password", async () => {
    const request = {
      email: "test@example.com",
      password: "password123",
      phone: "123456789",
      name: "Test User",
    };

    const result = await createUserCommand.execute(request);

    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("_id");
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
