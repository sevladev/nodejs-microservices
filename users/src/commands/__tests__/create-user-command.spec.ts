import "../../infra/env";
import { RedisProvider } from "../../providers/redis/redis-provider";
import { IRedisProvider } from "../../providers/redis/redis-types";
import { UserRepositoryInMemory } from "../../repositories/user-repository/user-repository-in-memory";
import { IUserRepository } from "../../repositories/user-repository/user-repository-types";
import { UserTokenRepositoryInMemory } from "../../repositories/user-token-repository/user-token-repository-in-memory";
import { IUserTokenRepository } from "../../repositories/user-token-repository/user-token-repository-types";
import { CreateUserCommand } from "../create-user-command";

jest.mock("../../providers/redis/redis-provider");

describe("create-user-command", () => {
  let userRepository: IUserRepository;
  let userTokenRepository: IUserTokenRepository;
  let redisProvider: IRedisProvider;
  let createUserCommand: CreateUserCommand;

  beforeAll(() => {
    const mockSet = jest.fn().mockResolvedValue(undefined);
    RedisProvider.prototype.set = mockSet;

    userRepository = new UserRepositoryInMemory();
    userTokenRepository = new UserTokenRepositoryInMemory();
    redisProvider = new RedisProvider();
    createUserCommand = new CreateUserCommand(
      userRepository,
      userTokenRepository,
      redisProvider
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
