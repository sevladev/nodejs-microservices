import { Request, Response } from "express";

import { UserGetMeCommand as Command } from "../commands/user-get-me-command";
import BaseController, { IControllerMethodType } from "./base-controller";
import { IUserRepository } from "../repositories/user-repository/user-repository-types";
import { ROLES_TYPES } from "../commons/constants";

export class UserGetMeController extends BaseController {
  constructor(private userRepository: IUserRepository) {
    super();
  }

  get handle(): IControllerMethodType {
    return {
      auth: {
        roles: [ROLES_TYPES.USER, ROLES_TYPES.ROOT],
      },
      schema: {},
      fn: async (req: Request, res: Response): Promise<unknown> => {
        try {
          const requester_id = req.user._id;

          const command = new Command(this.userRepository);

          const result = await command.execute({
            requester_id,
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
