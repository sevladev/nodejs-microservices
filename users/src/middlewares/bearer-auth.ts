import { NextFunction, Request, Response } from "express";

import { verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { IAuthType, IRolesTypes } from "../controllers/base-controller";
import { ERRORS } from "../commons/constants";
import { IUserRepository } from "../repositories/user-repository/user-repository-types";

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
  userRepository: IUserRepository
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

      const getUser = await userRepository.findById(new ObjectId(_id), {
        role: 1,
        is_active: 1,
      });

      if (!getUser) {
        return res
          .status(ERRORS.UNAUTHORIZED.code)
          .json(ERRORS.UNAUTHORIZED.json);
      }

      if (!getUser.is_active) {
        return res.status(ERRORS.FORBIDDEN.code).json(ERRORS.FORBIDDEN.json);
      }

      if (!roles.includes(getUser.role as string)) {
        return res.status(ERRORS.FORBIDDEN.code).json(ERRORS.FORBIDDEN.json);
      }

      req.user = {
        _id: String(getUser._id),
      };

      next();
    } catch (error) {
      return res.status(ERRORS.FORBIDDEN.code).json(ERRORS.FORBIDDEN.json);
    }
  };
};
