import "../../infra/env";

import { UserRepositoryInMemory } from "../../repositories/user-repository/user-repository-in-memory";
import { IUserRepository } from "../../repositories/user-repository/user-repository-types";
import { CreateSessionCommand } from "../create-session-command";
import { CreateUserCommand } from "../create-user-command";
describe("create-session-command", () => {
  let userRepository: IUserRepository;
  let createSessionCommand: CreateSessionCommand;
  let createUserCommand: CreateUserCommand;

  const user = {
    email: "test@example.com",
    password: "password123",
    phone: "123456789",
    name: "Test User",
  };

  beforeAll(async () => {
    userRepository = new UserRepositoryInMemory();
    createSessionCommand = new CreateSessionCommand(userRepository);
    createUserCommand = new CreateUserCommand(userRepository);

    await createUserCommand.execute(user);
  });

  it("should be able to create a new session with valid credentials", async () => {
    const request = {
      password: user.password,
      email: user.email,
    };

    const result = await createSessionCommand.execute(request);

    expect(result).toHaveProperty("user");
    expect(result).toHaveProperty("token");
  });

  it("should be not able to create a new session with nonexistent email", async () => {
    const request = {
      password: user.password,
      email: "email@example1.com",
    };

    const result = await createSessionCommand.execute(request);

    expect(result).toBe(false);
  });

  it("should be not able to create a new session with invalid password", async () => {
    const request = {
      password: "123",
      email: user.email,
    };

    const result = await createSessionCommand.execute(request);

    expect(result).toBe(false);
  });
});
