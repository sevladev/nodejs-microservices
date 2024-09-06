import { Application } from "express";
import { App } from "../../infra/app";
import request from "supertest";
import { ObjectId } from "mongodb";
import { IUserTokenRepository } from "../../repositories/user-token-repository/user-token-repository-types";
import { UserTokenRepositoryInMemory } from "../../repositories/user-token-repository/user-token-repository-in-memory";
import moment from "moment";

jest.mock("../../providers/redis/redis-provider", () => {
  return {
    RedisProvider: jest.fn().mockImplementation(() => {
      return {
        set: jest.fn().mockResolvedValue(undefined),
        del: jest.fn().mockResolvedValue(undefined),
      };
    }),
  };
});

describe("refresh-token-controller", () => {
  let app: Application;
  let userTokenRepository: IUserTokenRepository;

  beforeAll(async () => {
    userTokenRepository = new UserTokenRepositoryInMemory();
    app = await new App().setup();
  });

  describe("schema validation", () => {
    it("should return an error if send invalid refresh_token format", async () => {
      const result = await request(app).post("/users/refresh-token/eoeksa");

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe(
        "Type a valid ObjectId (24 hex characters)."
      );
    });
  });

  it("should be able to receive a new token from a refresh token", async () => {
    const create_user = await request(app).post("/users").send({
      email: "test@example.com",
      password: "password123",
      phone: "42142141444",
      name: "Test User",
    });

    const result = await request(app).post(
      `/users/refresh-token/${create_user.body.result.refresh_token}`
    );

    expect(result.body.r).toBe(true);
    expect(result.body.result).toHaveProperty("token");
    expect(result.body.result).toHaveProperty("refresh_token");
  });

  it("it should be not able receive a new token if refresh token is too old", async () => {
    const create_user = await request(app).post("/users").send({
      email: "test1@example.com",
      password: "password123",
      phone: "42142141444",
      name: "Test User",
    });

    const refresh_token = new ObjectId(create_user.body.result.refresh_token);

    await userTokenRepository.updateExpiresToken(
      refresh_token,
      moment().subtract(1, "year").unix()
    );

    const result = await request(app).post(
      `/users/refresh-token/${refresh_token}`
    );

    expect(result.body.r).toBe(false);
    expect(result.body.error).toBe("refresh token expired");
  });

  it("it should be not able receive a new token if refresh_token nonexists", async () => {
    const result = await request(app).post(
      `/users/refresh-token/${new ObjectId()}`
    );

    expect(result.body.r).toBe(false);
    expect(result.body.error).toBe("refresh token not found");
  });
});
