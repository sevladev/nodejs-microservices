import { Request, Response } from "express";

import { CreateSessionCommand as Command } from "../commands/create-session-command";
import Joi from "joi";
import { Db } from "mongodb";
import BaseController, { IControllerMethodType } from "./base-controller";
import { userRepositories } from "../repositories/user-repository/user-repository";
import { ENVIROMENTS } from "../commons/constants";

export class CreateSessionController extends BaseController {
  constructor(private db: Db) {
    super();
  }

  get handle(): IControllerMethodType {
    return {
      auth: {
        roles: [],
      },
      schema: {
        body: Joi.object({
          password: Joi.string().required().messages({
            "string.empty": "Password is required.",
            "any.required": "Password is required.",
          }),
          email: Joi.string().email().required().messages({
            "string.email": "Type a valid email address.",
            "string.empty": "Email is required.",
            "any.required": "Email is required.",
          }),
        }),
      },
      fn: async (req: Request, res: Response): Promise<unknown> => {
        try {
          const { password, email } = req.body;

          const userRepository = new userRepositories[
            process.env.NODE_ENV as ENVIROMENTS
          ](this.db);

          const command = new Command(userRepository);

          const result = await command.execute({
            email,
            password,
          });

          if (command.isValid()) {
            return this.Ok(res, result);
          }

          return this.Fail(res, command.error);
        } catch (error) {
          return this.BadRequest(res, JSON.stringify(error));
        }
      },
    };
  }
}
