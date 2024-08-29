import { Application } from "express";
import { App } from "../../infra/app";
import request from "supertest";

describe("create-session-controller", () => {
  let app: Application;

  beforeAll(async () => {
    app = await new App().setup();

    await request(app).post("/users").send({
      email: "test@example.com",
      password: "password123",
      phone: "81995184990",
      name: "Test User",
    });
  });

  describe("Schema Validation", () => {
    it("should return an error if password is missing", async () => {
      const result = await request(app).post("/users/auth").send({
        email: "test@example.com",
      });

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe("Password is required.");
    });

    it("should return an error if email is missing", async () => {
      const result = await request(app).post("/users/auth").send({
        password: "password123",
      });

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe("Email is required.");
    });

    it("should return an error if email is invalid", async () => {
      const result = await request(app).post("/users/auth").send({
        password: "password123",
        email: "invalid-email",
      });

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe("Type a valid email address.");
    });
  });

  it("should be able to create a new session with valid credentials", async () => {
    const result = await request(app).post("/users/auth").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(result.body.r).toBe(true);
    expect(result.body.result).toHaveProperty("user");
    expect(result.body.result).toHaveProperty("token");
    expect(result.body.result).toHaveProperty("refresh_token");
    expect(result.body.result.user.password).toBe(null);
    expect(result.body.result.user).toHaveProperty("_id");
    expect(result.body.result.user).toHaveProperty("name");
  });

  it("should be not able to create a new session with nonexistent email", async () => {
    const result = await request(app).post("/users/auth").send({
      email: "test123@example.com",
      password: "password123",
    });

    expect(result.body.r).toBe(false);
    expect(result.body.error).toBe("invalid credentials");
  });

  it("should be not able to create a new session with inccorect password", async () => {
    const result = await request(app).post("/users/auth").send({
      email: "test@example.com",
      password: "password123123",
    });

    expect(result.body.r).toBe(false);
    expect(result.body.error).toBe("invalid credentials");
  });
});
