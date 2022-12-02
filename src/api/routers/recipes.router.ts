import express from 'express';

export function recipesRouter(controller: RecipesController) {
  const router = express.Router();

  router.route('/').post(controller.addRecipe);

  return router;
}
