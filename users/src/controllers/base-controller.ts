import { Request, Response } from "express";
import Joi from "joi";

export type IAuthType = {
  roles: string[];
};

export type ISchemaType = {
  body?: Joi.ObjectSchema<any>;
  params?: Joi.ObjectSchema<any>;
  query?: Joi.ObjectSchema<any>;
};

export type IControllerMethodType = {
  auth: IAuthType;
  schema: ISchemaType;
  fn: (req: Request, resp: Response) => Promise<unknown>;
};

export type IRolesTypes = "toor" | "resu";

export default class BaseController {
  Redirect(res: Response, url: string): void {
    res.redirect(url);
  }

  Ok(res: Response, result: unknown): void {
    res.status(200).send({
      r: true,
      result,
    });
  }

  Fail(res: Response, error: string): void {
    res.status(400).send({
      r: false,
      error,
    });
  }

  BadRequest(res: Response, errors: any): void {
    const errorType = errors?.name;
    let error = null;

    switch (errorType) {
      case "ValidationError":
        error = errors.errors;
        break;
      default:
        error = errors;
        break;
    }

    res.status(400).json({
      r: false,
      errors: error,
    });
  }
}
