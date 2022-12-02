import express from 'express';

export function recipesRouter(controller: RecipesController) {
  const router = express.Router();

  router.route('/').get(controller.getAll).post(controller.addRecipe);

  return router;
}
