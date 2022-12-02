import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ApplicationError } from '../../errors/application.error';
import { makeResponseBody } from '../utils';

declare global {
  interface AuthController {
    register: RequestHandler;
    login: RequestHandler;
    logout: RequestHandler;
    getUserProfile: RequestHandler;
  }
}

export function authController(users: UsersCollection) {
  async function register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await users.register({
        email,
        password,
      } as UserRegistrationData);
      const token = res.generateToken(user);
      res.status(201).json(
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

      // Perform login only if user didn't supply a valid token or
      if (user?.email !== email) {
        user = await users.authenticate({ email, password } as UserCredentials);
        token = res.generateToken(user);
      }

      // Return the user a new token or the same if it was valid already
      res.status(200).json(
        makeResponseBody({
          user: {
            id: user!.id,
            email: user!.email,
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
      const user = await users.getById(req.user?.id!, {});
      res.status(200).json(makeResponseBody({ user }));
    } catch (err: any) {
      if (err.name && err.name === 'NotFound') {
        return next(
          new ApplicationError('AuthorizationError', 'You are not logged in')
        );
      }
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
