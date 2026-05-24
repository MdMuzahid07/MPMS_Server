/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

const requestValidator = (schema: ZodObject<any, any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("REQUEST VALIDATOR BODY:", req.body);
      if (schema.shape && "body" in schema.shape) {
        await schema.parseAsync({
          body: req.body,
          cookies: req.cookies,
          query: req.query,
          params: req.params,
        });
      } else {
        await schema.parseAsync(req.body);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default requestValidator;
