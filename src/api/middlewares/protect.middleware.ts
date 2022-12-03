import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ApplicationError } from '../../errors/application.error';

export function protect(): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.user) {
      return next();
    }

    const authError = new ApplicationError('AuthorizationError', 'You are not authenticated');
    next(authError);
  };
}
