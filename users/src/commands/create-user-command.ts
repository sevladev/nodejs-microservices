import { Db } from "mongodb";
import { BaseCommand } from "./base-command";

interface Request {
  email: string;
  password: string;
  phone: string;
  name: string;
}

export class CreateUserCommand extends BaseCommand {
  db: Db;

  constructor(db: Db) {
    super();

    this.db = db;
  }

  async execute(payload: Request) {
    return { ...payload };
  }
}
