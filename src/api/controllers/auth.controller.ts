import { NextFunction, Request, Response } from 'express';
import { formatSuccessfullResponse } from '../utils/format-response';

export function authController(users: UsersCollection) {
  async function register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await users.register({ email, password });
      const token = res.generateToken(user);
      res.status(200).json(
        formatSuccessfullResponse({
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
      let token = req.token;
      if (!token) {
        const { email, password } = req.body;
        const user = await users.authenticate(email, password);
        token = res.generateToken(user);
      }

      res.status(200).json({
        status: 'success',
        message: 'You were logged in successfully',
        token,
      });
    } catch (err) {
      next(err);
    }
  }

  async function logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.token) {
        res.blacklistToken(req.token);
      }
      res.status(200).json({
        status: 'success',
        message: 'You were logged out successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  return Object.freeze({
    register,
    login,
    logout,
  });
}
