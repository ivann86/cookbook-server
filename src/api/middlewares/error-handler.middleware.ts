import {
  Application,
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import { ApplicationError } from '../../errors/application.error';

export function errorHandler(): ErrorRequestHandler {
  const errorHandlers: any = {
    ValidationError: {
      statusCode: 400,
      message: (err: any) => err.message,
    },
    DuplicationError: {
      statusCode: 400,
      message: (err: any) => err.message,
    },
    AuthorizationError: {
      statusCode: 401,
      message: (err: any) => err.message,
    },
  };
  return function (err: any, req: Request, res: Response, next: NextFunction) {
    if (!(err.name in errorHandlers)) {
      return res.status(500).json({ status: 'fail', message: 'Server error' });
    }
    const resDetails = errorHandlers[err.name];

    res
      .status(resDetails.statusCode)
      .json({ status: 'fail', message: resDetails.message(err) });
  };
}
