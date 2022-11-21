import { NextFunction, Request, Response } from 'express';
import { ApplicationError } from '../../errors/application.error';
import { makeResponseBody } from '../utils';

export function authController(users: UsersCollection) {
  async function register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await users.register({ email, password });
      const token = res.generateToken(user);
      res.status(200).json(
        makeResponseBody({
          user: {
            id: user.id,
            email: user.email,
          },
          token,
        })
      );
    } catch (err) {
      next(err);
    }
  }

  async function login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      let token = req.token;
      let user = req.user;

      // Perform login only users didn't supply a valid token
      if (!token || !(user && user.email === email)) {
        user = await users.authenticate(email, password);
        token = res.generateToken(user);
      }

      // Return the user a new token or the same if it was valid already
      res.status(200).json(
        makeResponseBody({
          user: {
            id: user.id,
            email: user.email,
          },
          token,
        })
      );
    } catch (err) {
      next(err);
    }
  }

  async function logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.token) {
        throw new ApplicationError(
          'AuthorizationError',
          'You are not logged in'
        );
      }

      res.blacklistToken(req.token);
      res.status(200).json(makeResponseBody(undefined));
    } catch (err) {
      next(err);
    }
  }

  async function getUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await users.getById(req.user?.id!);
      res.status(200).json(makeResponseBody(user));
    } catch (err) {
      next(err);
    }
  }

  return Object.freeze({
    register,
    login,
    logout,
    getUserProfile,
  });
}
