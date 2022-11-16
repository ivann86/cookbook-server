import express, { RequestHandler } from 'express';

declare global {
  interface AuthController {
    register: RequestHandler;
    login: RequestHandler;
    logout: RequestHandler;
  }
}

export function authRouter(controller: AuthController) {
  const router = express.Router();

  router.route('/register').post(controller.register);
  router.route('/login').post(controller.login);
  router.route('/logout').get(controller.logout);

  return router;
}
