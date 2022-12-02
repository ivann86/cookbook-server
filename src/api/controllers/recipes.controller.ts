import { NextFunction, Request, RequestHandler, Response } from 'express';
import { makeResponseBody } from '../utils';

declare global {
  interface RecipesController {
    addRecipe: RequestHandler;
    getAll: RequestHandler;
    // getById: RequestHandler;
  }
}

export function recipesController(recipes: RecipesCollection) {
  async function addRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await recipes.add(req.body);
      res.status(201).json(makeResponseBody(result));
    } catch (err) {
      next(err);
    }
  }

  async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await recipes.getAll({});
      res.status(200).json(makeResponseBody(results));
    } catch (err) {
      next(err);
    }
  }

  return Object.freeze({
    addRecipe,
    getAll,
  });
}
