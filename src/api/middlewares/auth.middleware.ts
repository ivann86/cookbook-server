import jwt from 'jsonwebtoken';
import { RequestHandler, Request, Response, NextFunction } from 'express';

export function authentication(
  jwtSecret: string,
  jwtExpiresIn: string
): RequestHandler {
  function generateToken(user: User) {
    const payload = {
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
    this.setHeader('Authorization', `Bearer ${token}`);
  }

  return function (req: Request, res: any, next: NextFunction) {
    res.setTokenHeader = generateToken;
  };
}
