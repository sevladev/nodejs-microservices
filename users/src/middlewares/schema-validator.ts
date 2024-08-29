import { NextFunction, Request, Response } from "express";
import { ISchemaType } from "../controllers/base-controller";

export const schemaValidator = (schema: ISchemaType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    if (schema.body) {
      const body = schema.body.validate(req.body);
      if (body.error) {
        body.error.details.map((err) => errors.push(err.message));
      }
    }

    if (schema.params) {
      const params = schema.params.validate(req.params);
      if (params.error) {
        params.error.details.map((err) => errors.push(err.message));
      }
    }

    if (schema.query) {
      const query = schema.query.validate(req.query);
      if (query.error) {
        query.error.details.map((err) => errors.push(err.message));
      }
    }

    if (errors.length) {
      return res.status(400).json({ r: false, error: errors.join(",") });
    }

    next();
  };
};
