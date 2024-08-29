import { Application } from "express";
import { App } from "../../infra/app";
import request from "supertest";
import { ObjectId } from "mongodb";
import { IUserTokenRepository } from "../../repositories/user-token-repository/user-token-repository-types";
import { UserTokenRepositoryInMemory } from "../../repositories/user-token-repository/user-token-repository-in-memory";
import { UserTokenEntity } from "../../entities/user-token-entity";
import moment from "moment";

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

  describe("ensure authentication", () => {
    const refresh_token = new ObjectId();

    it("should be not able to receive a new token with expired token", async () => {
      const result = await request(app)
        .post(`/users/refresh-token/${refresh_token}`)
        .set({
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        });

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe("Forbidden.");
    });

    it("should be not able to receive a new token without token", async () => {
      const result = await request(app).post(
        `/users/refresh-token/${refresh_token}`
      );

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe("Invalid token, auth again.");
    });

    it("should be not able to receive a new token with invalid token", async () => {
      const result = await request(app)
        .post(`/users/refresh-token/${refresh_token}`)
        .set({ authorization: "token" });

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe("Forbidden.");
    });
  });

  it("should be able to receive a new token from a refresh token", async () => {
    const create_user = await request(app).post("/users").send({
      email: "test@example.com",
      password: "password123",
      phone: "42142141444",
      name: "Test User",
    });

    const result = await request(app)
      .post(`/users/refresh-token/${create_user.body.result.refresh_token}`)
      .set({
        authorization: `Bearer ${create_user.body.result.token}`,
      });

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

    const result = await request(app)
      .post(`/users/refresh-token/${refresh_token}`)
      .set({
        authorization: `Bearer ${create_user.body.result.token}`,
      });

    expect(result.body.r).toBe(false);
    expect(result.body.error).toBe("refresh token expired");
  });

  it("it should be not able receive a new token if happens mismatch between requester_id and refresh_token", async () => {
    const create_user = await request(app).post("/users").send({
      email: "test2@example.com",
      password: "password123",
      phone: "42142141444",
      name: "Test User",
    });
    const create_second_user = await request(app).post("/users").send({
      email: "test3@example.com",
      password: "password123",
      phone: "42142141444",
      name: "Test User",
    });

    const refresh_token = new ObjectId(create_user.body.result.refresh_token);

    const result = await request(app)
      .post(`/users/refresh-token/${refresh_token}`)
      .set({
        authorization: `Bearer ${create_second_user.body.result.token}`,
      });

    expect(result.body.r).toBe(false);
    expect(result.body.error).toBe("invalid refresh token");
  });
});
