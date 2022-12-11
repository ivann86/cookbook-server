import express from 'express';
import cookieParser from 'cookie-parser';
import { authController, recipesController } from './controllers';
import { authRouter, recipesRouter } from './routers';
import { bearerToken, errorHandler } from './middlewares';
import exp from 'constants';

declare global {
  interface ApiOptions {
    jwtSecret: string;
    jwtExpiresIn: number;
  }
}

export function api(
  users: UsersCollection,
  recipes: RecipesCollection,
  invalidTokens: InvalidTokensStore,
  options: ApiOptions
) {
  const router = express.Router();

  router.use(cookieParser());
  router.use(bearerToken(invalidTokens, users, options.jwtSecret, options.jwtExpiresIn));
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));

  router.use('/auth', authRouter(authController(users)));
  router.use('/recipes', recipesRouter(recipesController(recipes)));

  router.route('*').all((req, res) => res.status(404).json({ message: 'This route does not exist' }));

  router.use(errorHandler());

  return router;
}
