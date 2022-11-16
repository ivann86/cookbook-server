import jwt from 'jsonwebtoken';
import { RequestHandler, Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
    }
    interface Response {
      setTokenHeader?: Function;
    }
  }
}

export function authentication(
  jwtSecret: string,
  jwtExpiresIn: string
): RequestHandler {
  function generateToken(user: User) {
    const payload = {
      username: user.username,
      email: user.email,
    };
    return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
  }

  return function (req: Request, res: Response, next: NextFunction) {
    res.setTokenHeader = (user: User) => {
      const token = generateToken(user);
      res.setHeader('Authorization', `Bearer ${token}`);
    };
  };
}
