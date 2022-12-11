import express from 'express';
import { protect } from '../middlewares';

export function recipesRouter(controller: RecipesController) {
  const router = express.Router();

  router.route('/id/:id').get(controller.getById);
  router.route('/sample').get(controller.getTagSample);
  router
    .route('/:slug')
    .get(controller.getBySlug)
    .patch(protect(), controller.upload, controller.patchRecipe)
    .delete(protect(), controller.removeRecipe);
  router.route('/').get(controller.getAll).post(protect(), controller.upload, controller.addRecipe);

  return router;
}
