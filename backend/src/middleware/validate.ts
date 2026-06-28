import { AnyZodObject, ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';

export function validateBody(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next({ status: 400, message: 'Validation error', details: error.flatten().fieldErrors });
      }
      return next(error);
    }
  };
}

export function validateQuery(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next({ status: 400, message: 'Validation error', details: error.flatten().fieldErrors });
      }
      return next(error);
    }
  };
}

export function validateParams(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next({ status: 400, message: 'Validation error', details: error.flatten().fieldErrors });
      }
      return next(error);
    }
  };
}
