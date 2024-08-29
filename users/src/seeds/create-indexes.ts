import { Db } from "mongodb";
import { collections } from "../infra/mongo-db";

export const createIndexes = async (db: Db) => {
  try {
    await db
      .collection(collections.users)
      .createIndex({ email: 1 }, { unique: true });
    await db
      .collection(collections.users_tokens)
      .createIndex({ user_id: 1 }, { unique: true });
    await db
      .collection(collections.users_tokens)
      .createIndex({ refresh_token: 1 });
  } catch (error) {}
};
