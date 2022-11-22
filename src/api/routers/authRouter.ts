import express, { RequestHandler } from 'express';

export function authRouter(controller: AuthController) {
  const router = express.Router();

  router.route('/register').post(controller.register);
  router.route('/login').post(controller.login);
  router.route('/logout').get(controller.logout);
  router.route('/profile').get(controller.getUserProfile);

  return router;
}
