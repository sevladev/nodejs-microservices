import { Application, Router } from "express";
import { Db } from "mongodb";
import { CreateUserController } from "../controllers/create-user-controller";
import { schemaValidator } from "../middlewares/schema-validator";
import { CreateSessionController } from "../controllers/create-session-controller";
import { getUserRepositories } from "../repositories/user-repository/user-repository";
import { getUserTokenRepositories } from "../repositories/user-token-repository/user-token-repository";
import { UserGetMeController } from "../controllers/user-get-me-controller";
import { ensureAuthentication } from "../middlewares/bearer-auth";
import { RefreshTokenController } from "../controllers/refresh-token-controller";
import { RedisProvider } from "../providers/redis/redis-provider";

export class UserRoutes {
  static setup(app: Application, db: Db) {
    const router = Router();

    const userRepository = getUserRepositories(db);
    const userTokenRepository = getUserTokenRepositories(db);

    const redisProvider = new RedisProvider();

    const { handle: createUser } = new CreateUserController(
      userRepository,
      userTokenRepository,
      redisProvider
    );
    const { handle: createSession } = new CreateSessionController(
      userRepository,
      userTokenRepository,
      redisProvider
    );
    const { handle: userGetMe } = new UserGetMeController(userRepository);
    const { handle: refreshToken } = new RefreshTokenController(
      userTokenRepository
    );

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
    router.post(
      "/refresh-token/:refresh_token",
      schemaValidator(refreshToken.schema),
      ensureAuthentication(refreshToken.auth, userRepository),
      refreshToken.fn
    );

    app.use("/users", router);
  }
}
