import { Db, MongoClient } from "mongodb";

let dbInstance: Db;

export class MongoDb {
  async connect(): Promise<Db> {
    const mongoClient = await MongoClient.connect(
      process.env.MONGODB_URL as string
    );

    const database = mongoClient.db(process.env.MONGODB_DATABASE);

    return database;
  }

  static async getDb(): Promise<Db> {
    if (dbInstance) {
      return dbInstance;
    }

    const db = await new MongoDb().connect();

    dbInstance = db;

    return db;
  }
}

export const collections = {
  users: "users",
  users_tokens: "users_tokens",
};
