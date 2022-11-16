import { NextFunction, Request, Response } from 'express';

export function authController(users: UsersCollection) {
  async function register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await users.create(req.body);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }

  async function login(req: Request, res: Response, next: NextFunction) {}

  async function logout(req: Request, res: Response, next: NextFunction) {
    res.send('Api endpoint not implemented yet');
  }

  return Object.freeze({
    register,
    login,
    logout,
  });
}
