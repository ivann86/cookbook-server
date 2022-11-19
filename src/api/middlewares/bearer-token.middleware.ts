import jwt from 'jsonwebtoken';
import { RequestHandler, Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      token?: string;
    }
    interface Response {
      generateToken: (user: User) => string;
      blacklistToken: (token: string) => Promise<Boolean>;
    }
  }
}

export function bearerToken(
  store: InvalidTokensStore,
  jwtSecret: string,
  jwtExpiresIn: number
): RequestHandler {
  return async function (req: Request, res: Response, next: NextFunction) {
    res.generateToken = (user: User) => {
      const payload = {
        id: user.id,
        email: user.email,
      };
      return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
    };

    res.blacklistToken = async (token) => {
      try {
        await store.insert(token, new Date(Date.now() + jwtExpiresIn));
        return true;
      } catch (err) {
        return false;
      }
    };

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next();
    }

    try {
      if (await store.isBlacklisted(token)) {
        return next();
      }
      req.user = jwt.verify(token, jwtSecret) as any;
      req.token = token;
      return next();
    } catch (err) {
      return next();
    }
  };
}
