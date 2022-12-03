import express from 'express';
import { protect } from '../middlewares';

export function recipesRouter(controller: RecipesController) {
  const router = express.Router();

  router.route('/:id').get(controller.getById);
  router.route('/').get(controller.getAll).post(protect(), controller.addRecipe);

  return router;
}
