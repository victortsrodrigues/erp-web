import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/appError';
import { Prisma } from '@prisma/client';

export function errorHandlerMiddleware(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    
    const regex = /Unique constraint failed on the fields: \(`[a-zA-Z]+`\)/;
    const match = regex.exec(error.message);

    if (match) {
      response.status(400).json({
        message: `${match[0]}`
      });
      return;
    }

    response.status(400).json({
      code: error.code,
      message: error.message,
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
}