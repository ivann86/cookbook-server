import jwt from 'jsonwebtoken';
import { RequestHandler, Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
    }
    interface Response {
      createSession: (user: User) => void;
      clearSession: () => void;
    }
  }
}

/**
 * An Express middlware to manage cookie sessions with JSON Web Tokens
 * @param users A users collection
 * @param jwtSecret A secret key to use when generating JSON Web Token
 * @param jwtExpiresIn JSON Web Token expiration period
 * @returns An Express middleware
 */
export function session(
  users: UsersCollection,
  jwtSecret: string,
  jwtExpiresIn: string
): RequestHandler {
  return async function (req: Request, res: Response, next: NextFunction) {
    // Attach a method to send cookie with jwt
    /**
     * Creates a session
     * @param user The user to create a session for
     */
    res.createSession = (user: User) => {
      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
      };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
      res.cookie('jwt', token, { httpOnly: true });
    };

    /**
     * Clears user's session by sending clear cookie
     */
    // Atach a method to clear the jwt cookie
    res.clearSession = () => {
      res.clearCookie('jwt');
    };

    // Check if client sent jwt cookie
    if (!(req.cookies && 'jwt' in req.cookies)) {
      return next();
    }

    try {
      const payload = jwt.verify(req.cookies.jwt, jwtSecret) as any;
      req.user = await users.findById(payload.id);
      return next();
    } catch (err) {
      res.clearCookie('jwt');
      return next();
    }
  };
}
