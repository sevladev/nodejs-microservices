import { Request, Response } from "express";

import { RefreshTokenCommand as Command } from "../commands/refresh-token-command";
import BaseController, { IControllerMethodType } from "./base-controller";
import { ROLES_TYPES } from "../commons/constants";
import { IUserTokenRepository } from "../repositories/user-token-repository/user-token-repository-types";
import Joi from "joi";
import { IRedisProvider } from "../providers/redis/redis-types";

export class RefreshTokenController extends BaseController {
  constructor(
    private userTokenRepository: IUserTokenRepository,
    private redisProvider: IRedisProvider
  ) {
    super();
  }

  get handle(): IControllerMethodType {
    return {
      auth: {
        roles: [ROLES_TYPES.USER, ROLES_TYPES.ROOT],
      },
      schema: {
        params: Joi.object({
          refresh_token: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
              "string.pattern.base":
                "Type a valid ObjectId (24 hex characters).",
              "string.empty": "Refresh token is required.",
              "any.required": "Refresh token is required.",
            }),
        }),
      },
      fn: async (req: Request, res: Response): Promise<unknown> => {
        try {
          const { refresh_token } = req.params;
          const requester_id = req.user._id;

          const command = new Command(
            this.userTokenRepository,
            this.redisProvider
          );

          const result = await command.execute({
            requester_id,
            refresh_token,
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
