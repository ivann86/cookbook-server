import { createDataStore } from './data.store';
import { Recipe } from './recipe.model';

export function createRecipeStore(): RecipesDataStore {
  return createDataStore<Recipe>(Recipe);
}
