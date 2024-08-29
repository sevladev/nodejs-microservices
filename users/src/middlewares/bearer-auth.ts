import { NextFunction, Request, Response } from "express";

import { verify } from "jsonwebtoken";
import { Db, ObjectId } from "mongodb";
import { IAuthType, IRolesTypes } from "../controllers/base-controller";
import { ERRORS } from "../commons/constants";
import { collections } from "../infra/mongo-db";

export type IDecodedTokenType = {
  _id: string;
  role: IRolesTypes;
};

declare module "express" {
  interface Request {
    user?: {
      _id: string;
    };
  }
}

export const ensureAuthentication = (auth: IAuthType, db: Db) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const collection = db.collection(collections.users);

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

      const getUser = await collection.findOne(
        { _id: new ObjectId(_id) },
        { projection: { is_active: 1, role: 1 } }
      );

      if (!getUser) {
        return res
          .status(ERRORS.UNAUTHORIZED.code)
          .json(ERRORS.UNAUTHORIZED.json);
      }

      if (!getUser.is_active) {
        return res.status(ERRORS.FORBIDDEN.code).json(ERRORS.FORBIDDEN.json);
      }

      if (!roles.includes(getUser.role)) {
        return res.status(ERRORS.FORBIDDEN.code).json(ERRORS.FORBIDDEN.json);
      }

      req.user = {
        _id: String(getUser._id),
      };

      next();
    } catch (error) {
      return res
        .status(ERRORS.EXPIRED_TOKEN.code)
        .json(ERRORS.EXPIRED_TOKEN.json);
    }
  };
};
