import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { AppError } from '../errors/appError';

dotenv.config();

interface TokenPayload {
  id: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token not provided', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? 'default_secret') as TokenPayload;

    if (!decoded || typeof decoded !== 'object' || !decoded.id || !decoded.roles || !decoded.permissions) {
      throw new AppError('Invalid JWT Token', 401);
    }

    req.user = {
      id: decoded.id,
      roles: decoded.roles,
      permissions: decoded.permissions
    };

    return next();
  } catch (error) {
    throw new AppError(`Invalid JWT Token: ${error}`, 401);
  }
}
