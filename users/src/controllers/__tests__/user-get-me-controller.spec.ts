import { Application } from "express";
import { App } from "../../infra/app";
import request from "supertest";

jest.mock("../../providers/redis/redis-provider", () => {
  return {
    RedisProvider: jest.fn().mockImplementation(() => {
      return {
        set: jest.fn().mockResolvedValue(undefined),
        del: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue(undefined),
      };
    }),
  };
});

describe("user-get-me-controller", () => {
  let app: Application;
  let token: string;

  beforeAll(async () => {
    app = await new App().setup();

    const result = await request(app).post("/users").send({
      email: "test@example.com",
      password: "password123",
      phone: "81995184990",
      name: "Test User",
    });

    token = `Bearer ${result.body.result.token}`;
  });

  it("should be able to get a user profile data from your _id", async () => {
    const result = await request(app).get("/users/me").set({
      authorization: token,
    });

    expect(result.body.r).toBe(true);
    expect(result.body.result).toHaveProperty("email");
    expect(result.body.result.password).toBe(null);
    expect(result.body.result).toHaveProperty("_id");
    expect(result.body.result).toHaveProperty("name");
  });
});
