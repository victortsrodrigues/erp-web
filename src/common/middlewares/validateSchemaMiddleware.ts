import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { fromZodError } from "zod-validation-error";

export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = schema.safeParse(req.body);

    if (!req.body.success) {
      const zodError = fromZodError(req.body.error);

      const errors = zodError.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))

      res.status(400).json({
        status:  'error',
        errors
      })
      return;
    }

    next();
  };
};
