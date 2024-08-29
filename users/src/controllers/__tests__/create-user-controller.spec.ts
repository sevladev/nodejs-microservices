import { Application } from "express";
import { App } from "../../infra/app";
import request from "supertest";

describe("create-user-controller", () => {
  let app: Application;

  beforeAll(async () => {
    app = await new App().setup();
  });

  describe("Schema Validation", () => {
    it("should return an error if name is missing", async () => {
      const result = await request(app).post("/users").send({
        email: "test@example.com",
        password: "password123",
        phone: "1234567890",
      });

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe("Name is required.");
    });

    it("should return an error if name contains numbers", async () => {
      const result = await request(app).post("/users").send({
        name: "Test123",
        email: "test@example.com",
        password: "password123",
        phone: "1234567890",
      });

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe("Name must not contain numbers.");
    });

    it("should return an error if password is missing", async () => {
      const result = await request(app).post("/users").send({
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
      });

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe("Password is required.");
    });

    it("should return an error if email is missing", async () => {
      const result = await request(app).post("/users").send({
        name: "Test User",
        password: "password123",
        phone: "1234567890",
      });

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe("Email is required.");
    });

    it("should return an error if email is invalid", async () => {
      const result = await request(app).post("/users").send({
        name: "Test User",
        password: "password123",
        email: "invalid-email",
        phone: "1234567890",
      });

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe("Type a valid email address.");
    });

    it("should return an error if phone is missing", async () => {
      const result = await request(app).post("/users").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe("Phone number is required.");
    });

    it("should return an error if phone is invalid", async () => {
      const result = await request(app).post("/users").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        phone: "dsa",
      });

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe(
        "Type a valid phone number with 10 to 15 digits."
      );
    });
  });

  it("should be able to create a new user and return itself without password", async () => {
    const result = await request(app).post("/users").send({
      email: "test@example.com",
      password: "password123",
      phone: "81995184990",
      name: "Test User",
    });

    expect(result.body.r).toBe(true);
    expect(result.body.result.user.password).toBe(null);
    expect(result.body.result).toHaveProperty("user");
    expect(result.body.result).toHaveProperty("token");
    expect(result.body.result).toHaveProperty("refresh_token");
  });

  it("should be not able to create a user with existent email", async () => {
    const result = await request(app).post("/users").send({
      email: "test@example.com",
      password: "password123",
      phone: "81995184990",
      name: "Test User",
    });

    expect(result.body.r).toBe(false);
    expect(result.body.error).toBe("email already registered");
  });
});
