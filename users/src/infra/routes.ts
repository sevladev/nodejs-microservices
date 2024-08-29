import { Application, Router } from "express";
import { Db } from "mongodb";
import { CreateUserController } from "../controllers/create-user-controller";
import { schemaValidator } from "../middlewares/schema-validator";
import { CreateSessionController } from "../controllers/create-session-controller";

export class UserRoutes {
  static setup(app: Application, db: Db) {
    const router = Router();

    const { handle: createUser } = new CreateUserController(db);
    const { handle: createSession } = new CreateSessionController(db);

    router.post("/", schemaValidator(createUser.schema), createUser.fn);
    router.post(
      "/auth",
      schemaValidator(createSession.schema),
      createSession.fn
    );

    app.use("/users", router);
  }
}
