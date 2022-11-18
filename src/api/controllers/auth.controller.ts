import { NextFunction, Request, Response } from 'express';

export function authController(users: UsersCollection) {
  async function register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await users.register({ email, password });
      const token = res.generateToken(user);
      res.status(200).json({ user, token });
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  async function login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await users.authenticate(email, password);
      const token = res.generateToken(user);

      res.status(200).json({
        status: 'success',
        message: 'You were logged in successfully',
        token,
      });
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  async function logout(req: Request, res: Response, next: NextFunction) {
    try {
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
