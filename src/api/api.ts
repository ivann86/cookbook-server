import express from 'express';
import cookieParser from 'cookie-parser';
import { authController } from './controllers';
import { authRouter } from './routers';
import { bearerToken } from './middlewares';

declare global {
  interface ApiOptions {
    jwtSecret: string;
    jwtExpiresIn: string;
  }
}

export function api(
  users: UsersCollection,
  invalidTokens: InvalidTokensStore,
  options: ApiOptions
) {
  const router = express.Router();

  router.use(cookieParser());
  router.use(
    bearerToken(invalidTokens, options.jwtSecret, options.jwtExpiresIn)
  );
  router.use(express.json());
  router.use('/auth', authRouter(authController(users)));

  router
    .route('*')
    .all((req, res) =>
      res.status(404).json({ message: 'This route does not exist' })
    );

  return router;
}
