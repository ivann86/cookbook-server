import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

export function errorHandler(): ErrorRequestHandler {
  const knownErrors: any = {
    ValidationError: 400,
    DuplicationError: 400,
    AuthorizationError: 401,
    NotFound: 404,
  };

  return function (err: any, req: Request, res: Response, next: NextFunction) {
    if (process.env.ENVIRONMENT === 'DEV') {
      console.log(err);
    }
    if (process.env.ENVIRONMENT !== 'DEV' && !(err.name in knownErrors)) {
      return res.status(500).json({ status: 'fail', message: 'Server error' });
    }

    const error: { message: string; details?: unknown[] } = { message: err.message };
    if ('details' in err) {
      error.details = err.details;
    }

    res.status(knownErrors[err.name] || 500).json({
      status: 'fail',
      error,
    });
  };
}
