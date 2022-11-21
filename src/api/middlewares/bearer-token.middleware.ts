import jwt from 'jsonwebtoken';
import { RequestHandler, Request, Response, NextFunction } from 'express';

declare global {
  interface InvalidTokensStore {
    insert(token: string, expireAt: Date): Promise<void>;
    check(token: string): Promise<Boolean>;
  }

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
  invalidTokens: InvalidTokensStore,
  users: UsersCollection,
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
        await invalidTokens.insert(token, new Date(Date.now() + jwtExpiresIn));
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
      if (await invalidTokens.check(token)) {
        return next();
      }

      const payload = jwt.verify(token, jwtSecret) as any;
      // Try to get the user. If this throws than don't use the token
      await users.getById(payload.id);
      req.user = payload;
      req.token = token;
      return next();
    } catch (err) {
      return next();
    }
  };
}
