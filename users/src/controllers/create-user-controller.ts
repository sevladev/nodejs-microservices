import { Request, Response } from "express";

import { CreateUserCommand as Command } from "../commands/create-user-command";
import Joi from "joi";
import BaseController, { IControllerMethodType } from "./base-controller";
import { IUserRepository } from "../repositories/user-repository/user-repository-types";

export class CreateUserController extends BaseController {
  constructor(private userRepository: IUserRepository) {
    super();
  }

  get handle(): IControllerMethodType {
    return {
      auth: {
        roles: [],
      },
      schema: {
        body: Joi.object({
          name: Joi.string()
            .pattern(/^[A-Za-z\s]+$/)
            .required()
            .messages({
              "string.empty": "Name is required.",
              "string.pattern.base": "Name must not contain numbers.",
              "any.required": "Name is required.",
            }),
          password: Joi.string().required().messages({
            "string.empty": "Password is required.",
            "any.required": "Password is required.",
          }),
          email: Joi.string().email().required().messages({
            "string.email": "Type a valid email address.",
            "string.empty": "Email is required.",
            "any.required": "Email is required.",
          }),
          phone: Joi.string()
            .pattern(/^[0-9]{10,15}$/)
            .required()
            .messages({
              "string.pattern.base":
                "Type a valid phone number with 10 to 15 digits.",
              "string.empty": "Phone number is required.",
              "any.required": "Phone number is required.",
            }),
        }),
      },
      fn: async (req: Request, res: Response): Promise<unknown> => {
        try {
          const { password, name, email, phone } = req.body;

          const command = new Command(this.userRepository);

          const result = await command.execute({
            name,
            email,
            password,
            phone,
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
