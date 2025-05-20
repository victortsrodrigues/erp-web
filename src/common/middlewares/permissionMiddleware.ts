import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/appError';

export function permissionMiddleware(permission: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { user } = req;

    if (!user) {
      throw new AppError('User not authenticated', 401);
    }

    const hasPermission = user.permissions.includes(permission);
    
    const isAdmin = user.permissions.includes('admin:all');

    if (!hasPermission && !isAdmin) {
      throw new AppError('User does not have permission', 403);
    }

    return next();
  };
}