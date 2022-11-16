import { NextFunction, Request, Response } from 'express';

export function authController(users: UsersCollection) {
  async function register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await users.register(req.body);
      res.createSession(user);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  async function login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await users.authenticate(
        req.body.username,
        req.body.password
      );
      res.createSession(user);
      res.status(200).json({
        status: 'success',
        message: 'You were logged in successfully',
      });
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  async function logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearSession();
      res.status(200).json({
        status: 'success',
        message: 'You were logged out successfully',
      });
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  return Object.freeze({
    register,
    login,
    logout,
  });
}
