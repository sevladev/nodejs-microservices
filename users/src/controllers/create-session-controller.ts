import { Request, Response } from "express";

import { CreateSessionCommand as Command } from "../commands/create-session-command";
import Joi from "joi";
import BaseController, { IControllerMethodType } from "./base-controller";
import { IUserRepository } from "../repositories/user-repository/user-repository-types";
import { IUserTokenRepository } from "../repositories/user-token-repository/user-token-repository-types";

export class CreateSessionController extends BaseController {
  constructor(
    private userRepository: IUserRepository,
    private userTokenRepository: IUserTokenRepository
  ) {
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

          const command = new Command(
            this.userRepository,
            this.userTokenRepository
          );

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
