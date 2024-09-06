import { NextFunction, Request, Response } from "express";

import { verify } from "jsonwebtoken";
import { IAuthType, IRolesTypes } from "../controllers/base-controller";
import { ERRORS } from "../commons/constants";
import { IRedisProvider } from "../providers/redis/redis-types";

export type IDecodedTokenType = {
  _id: string;
  role: IRolesTypes;
};

declare global {
  namespace Express {
    export interface Request {
      user: {
        _id: string;
      };
    }
  }
}

export const ensureAuthentication = (
  auth: IAuthType,
  redisProvider: IRedisProvider
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { roles } = auth;

    if (!roles.length) return next();

    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(ERRORS.UNAUTHORIZED.code)
        .json(ERRORS.UNAUTHORIZED.json);
    }

    const [_, token] = authorization.split(" ");

    try {
      const decoded = verify(token, process.env.PRIVATE_KEY as string);

      const { _id } = decoded as IDecodedTokenType;

      if (process.env.NODE_ENV === "test") {
        req.user = {
          _id,
        };

        return next();
      }

      const storedToken = await redisProvider.get(`auth-token-${_id}`);

      if (!storedToken) {
        return res
          .status(ERRORS.UNAUTHORIZED.code)
          .json(ERRORS.UNAUTHORIZED.json);
      }

      const payload = JSON.parse(storedToken);

      if (!payload.is_active) {
        return res.status(ERRORS.FORBIDDEN.code).json(ERRORS.FORBIDDEN.json);
      }

      if (!roles.includes(payload.role as string)) {
        return res.status(ERRORS.FORBIDDEN.code).json(ERRORS.FORBIDDEN.json);
      }

      if (payload.token !== token) {
        return res.status(ERRORS.FORBIDDEN.code).json(ERRORS.FORBIDDEN.json);
      }

      req.user = {
        _id,
      };

      return next();
    } catch (error) {
      return res.status(ERRORS.FORBIDDEN.code).json(ERRORS.FORBIDDEN.json);
    }
  };
};
