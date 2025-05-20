import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/appError';

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

  console.error(error);

  response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
}