import { Application, Router } from "express";
import { Db } from "mongodb";
import { CreateUserController } from "../controllers/create-user-controller";
import { schemaValidator } from "../middlewares/schema-validator";
import { CreateSessionController } from "../controllers/create-session-controller";
import { getUserRepositories } from "../repositories/user-repository/user-repository";

export class UserRoutes {
  static setup(app: Application, db: Db) {
    const router = Router();

    const userRepository = getUserRepositories(db);

    const { handle: createUser } = new CreateUserController(userRepository);
    const { handle: createSession } = new CreateSessionController(
      userRepository
    );

    router.post("/", schemaValidator(createUser.schema), createUser.fn);
    router.post(
      "/auth",
      schemaValidator(createSession.schema),
      createSession.fn
    );

    app.use("/users", router);
  }
}
