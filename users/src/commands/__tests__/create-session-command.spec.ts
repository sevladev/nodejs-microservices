import "../../infra/env";

import { RedisProvider } from "../../providers/redis/redis-provider";
import { IRedisProvider } from "../../providers/redis/redis-types";
import { UserRepositoryInMemory } from "../../repositories/user-repository/user-repository-in-memory";
import { IUserRepository } from "../../repositories/user-repository/user-repository-types";
import { UserTokenRepositoryInMemory } from "../../repositories/user-token-repository/user-token-repository-in-memory";
import { IUserTokenRepository } from "../../repositories/user-token-repository/user-token-repository-types";
import { CreateSessionCommand } from "../create-session-command";
import { CreateUserCommand } from "../create-user-command";

jest.mock("../../providers/redis/redis-provider");

describe("create-session-command", () => {
  let userRepository: IUserRepository;
  let userTokenRepository: IUserTokenRepository;
  let redisProvider: IRedisProvider;
  let createSessionCommand: CreateSessionCommand;
  let createUserCommand: CreateUserCommand;

  const user = {
    email: "test@example.com",
    password: "password123",
    phone: "123456789",
    name: "Test User",
  };

  beforeAll(async () => {
    const mockSet = jest.fn().mockResolvedValue(undefined);
    RedisProvider.prototype.set = mockSet;

    userRepository = new UserRepositoryInMemory();
    userTokenRepository = new UserTokenRepositoryInMemory();
    redisProvider = new RedisProvider();

    createSessionCommand = new CreateSessionCommand(
      userRepository,
      userTokenRepository,
      redisProvider
    );

    createUserCommand = new CreateUserCommand(
      userRepository,
      userTokenRepository,
      redisProvider
    );

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
    expect(result).toHaveProperty("refresh_token");
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

  it("should be not able to have more one token per user", async () => {
    const length = await userTokenRepository.countAll();
    expect(length).toBe(1);
  });
});
