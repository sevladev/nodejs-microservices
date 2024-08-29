import { Application } from "express";
import { App } from "../../infra/app";
import request from "supertest";

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

  describe("authentication", () => {
    it("should be not able to get a user profile with expired token", async () => {
      const result = await request(app).get("/users/me").set({
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      });

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe("Forbidden.");
    });

    it("should be not able to get a user profile without token", async () => {
      const result = await request(app).get("/users/me");

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe("Invalid token, auth again.");
    });

    it("should be not able to get a user profile with invalid token", async () => {
      const result = await request(app)
        .get("/users/me")
        .set({ authorization: "token" });

      expect(result.body.r).toBe(false);
      expect(result.body.error).toBe("Forbidden.");
    });
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
