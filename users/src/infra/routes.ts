import { Application, Router } from "express";
import { Db } from "mongodb";
import { CreateUserController } from "../controllers/create-user-controller";
import { schemaValidator } from "../middlewares/schema-validator";
import { CreateSessionController } from "../controllers/create-session-controller";
import { getUserRepositories } from "../repositories/user-repository/user-repository";
import { getUserTokenRepositories } from "../repositories/user-token-repository/user-token-repository";
import { UserGetMeController } from "../controllers/user-get-me-controller";
import { ensureAuthentication } from "../middlewares/bearer-auth";

export class UserRoutes {
  static setup(app: Application, db: Db) {
    const router = Router();

    const userRepository = getUserRepositories(db);
    const userTokenRepository = getUserTokenRepositories(db);

    const { handle: createUser } = new CreateUserController(
      userRepository,
      userTokenRepository
    );
    const { handle: createSession } = new CreateSessionController(
      userRepository,
      userTokenRepository
    );
    const { handle: userGetMe } = new UserGetMeController(userRepository);

    router.post("/", schemaValidator(createUser.schema), createUser.fn);
    router.post(
      "/auth",
      schemaValidator(createSession.schema),
      createSession.fn
    );
    router.get(
      "/me",
      ensureAuthentication(userGetMe.auth, userRepository),
      userGetMe.fn
    );

    app.use("/users", router);
  }
}
