import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { fromZodError } from "zod-validation-error";

export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = schema.safeParse(req.body);

    if (!req.body.success) {
      res.status(400).send(fromZodError(req.body.error).message);
      return;
    }

    next();
  };
};
