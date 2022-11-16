import express from 'express';
import { authController } from './controllers';
import { authRouter } from './routers';

export function api(users: UsersCollection) {
  const router = express.Router();

  router.use(express.json());
  router.use('/auth', authRouter(authController(users)));

  return router;
}
