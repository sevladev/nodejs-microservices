import { Application } from "express";
import express from "express";
import { Db } from "mongodb";
import { MongoDb } from "./mongo-db";
import cors from "cors";
import helmet from "helmet";
import { UserRoutes } from "../infra/routes";
import { createIndexes } from "../seeds/create-indexes";

export class App {
  app: Application;

  constructor() {
    this.app = express();
  }

  async database(): Promise<Db> {
    const database = await MongoDb.getDb();
    return database;
  }

  middlewares(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
  }

  module(database: Db): void {
    UserRoutes.setup(this.app, database);
  }

  async pre(db: Db) {
    await createIndexes(db);
  }

  async setup(): Promise<Application> {
    let mongoDb: Db;

    if (process.env.NODE_ENV !== "test") {
      mongoDb = await this.database();
    } else {
      mongoDb = null as any;
    }

    this.middlewares();
    this.module(mongoDb);
    await this.pre(mongoDb);

    return this.app;
  }
}
