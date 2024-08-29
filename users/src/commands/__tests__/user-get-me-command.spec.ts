import { ObjectId } from "mongodb";
import "../../infra/env";

import { UserRepositoryInMemory } from "../../repositories/user-repository/user-repository-in-memory";
import { IUserRepository } from "../../repositories/user-repository/user-repository-types";
import { UserTokenRepositoryInMemory } from "../../repositories/user-token-repository/user-token-repository-in-memory";
import { IUserTokenRepository } from "../../repositories/user-token-repository/user-token-repository-types";
import { CreateUserCommand } from "../create-user-command";
import { UserGetMeCommand } from "../user-get-me-command";
describe("user-get-me-command", () => {
  let userRepository: IUserRepository;
  let userTokenRepository: IUserTokenRepository;
  let createUserCommand: CreateUserCommand;
  let userGetMeCommand: UserGetMeCommand;

  const user = {
    email: "test@example.com",
    password: "password123",
    phone: "123456789",
    name: "Test User",
  };

  beforeAll(async () => {
    userRepository = new UserRepositoryInMemory();
    userTokenRepository = new UserTokenRepositoryInMemory();
    userGetMeCommand = new UserGetMeCommand(userRepository);
    createUserCommand = new CreateUserCommand(
      userRepository,
      userTokenRepository
    );

    await createUserCommand.execute(user);
  });

  it("should be able to get a user profile data from your _id", async () => {
    let requester_id: string = "";
    const getUser = await userRepository.findByEmail(user?.email);

    if (getUser) {
      requester_id = String(getUser._id);
    }

    const result = await userGetMeCommand.execute({ requester_id });

    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("_id");
  });
});
