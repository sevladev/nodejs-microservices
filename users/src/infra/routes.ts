import { Application, Router } from "express";
import { Db } from "mongodb";
import { CreateUserController } from "./controllers/create-user-controller";
import { schemaValidator } from "./middlewares/schema-validator";

export class UserRoutes {
  static setup(app: Application, db: Db) {
    const router = Router();

    const { handle: createUser } = new CreateUserController(db);

    router.post("/", schemaValidator(createUser.schema), createUser.fn);

    app.use("/users", router);
  }
}
