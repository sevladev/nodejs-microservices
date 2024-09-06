import { ObjectId } from "mongodb";
import { UserEntity } from "../../entities/user-entity";
import "../../infra/env";

import { UserRepositoryInMemory } from "../../repositories/user-repository/user-repository-in-memory";
import { IUserRepository } from "../../repositories/user-repository/user-repository-types";
import { UserTokenRepositoryInMemory } from "../../repositories/user-token-repository/user-token-repository-in-memory";
import { IUserTokenRepository } from "../../repositories/user-token-repository/user-token-repository-types";
import { CreateUserCommand } from "../create-user-command";
import { RefreshTokenCommand } from "../refresh-token-command";
import { UserTokenEntity } from "../../entities/user-token-entity";
import moment from "moment";
import { IRedisProvider } from "../../providers/redis/redis-types";
import { RedisProvider } from "../../providers/redis/redis-provider";

jest.mock("../../providers/redis/redis-provider");

describe("refresh-token-command", () => {
  let userRepository: IUserRepository;
  let userTokenRepository: IUserTokenRepository;
  let redisProvider: IRedisProvider;
  let createUserCommand: CreateUserCommand;
  let refreshTokenCommand: RefreshTokenCommand;

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
    refreshTokenCommand = new RefreshTokenCommand(
      userTokenRepository,
      redisProvider
    );
    createUserCommand = new CreateUserCommand(
      userRepository,
      userTokenRepository,
      redisProvider
    );
  });

  it("should be able to receive a new token from a refresh token", async () => {
    await createUserCommand.execute(user);
    const getUser = (await userRepository.findByEmail(
      user.email
    )) as UserEntity;
    const getToken = await userTokenRepository.findByUserId(getUser?._id);

    const result = await refreshTokenCommand.execute({
      refresh_token: String(getToken?._id),
      requester_id: String(getUser._id),
    });

    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("refresh_token");
  });

  it("it should be not able receive a new token if user not exists", async () => {
    await createUserCommand.execute(user);
    const getUser = (await userRepository.findByEmail(
      user.email
    )) as UserEntity;
    const getToken = await userTokenRepository.findByUserId(getUser?._id);

    const result = await refreshTokenCommand.execute({
      refresh_token: String(getToken?._id),
      requester_id: new ObjectId().toString(),
    });

    expect(result).toBe(false);
  });

  it("it should be not able receive a new token if refresh token is too old", async () => {
    await createUserCommand.execute(user);
    const getUser = (await userRepository.findByEmail(
      user.email
    )) as UserEntity;
    await userTokenRepository.createOrUpdate(
      new UserTokenEntity({
        user_id: getUser._id,
        expires_at: moment().subtract(1, "year").unix(),
      })
    );
    const getToken = await userTokenRepository.findByUserId(getUser?._id);

    const result = await refreshTokenCommand.execute({
      refresh_token: String(getToken?._id),
      requester_id: getUser._id.toString(),
    });

    expect(result).toBe(false);
  });

  it("it should be not able receive a new token if happens mismatch between requester_id and refresh_token", async () => {
    await createUserCommand.execute({
      email: "test3@example.com",
      password: "password123",
      phone: "123456789",
      name: "Test User",
    });
    await createUserCommand.execute({
      email: "test2@example.com",
      password: "password123",
      phone: "123456789",
      name: "Test User",
    });

    const getUser = (await userRepository.findByEmail(
      "test3@example.com"
    )) as UserEntity;
    const getSecondUser = (await userRepository.findByEmail(
      "test2@example.com"
    )) as UserEntity;
    const getToken = await userTokenRepository.findByUserId(getUser?._id);

    const result = await refreshTokenCommand.execute({
      refresh_token: String(getToken?._id),
      requester_id: String(getSecondUser._id),
    });

    expect(result).toBe(false);
  });
});
