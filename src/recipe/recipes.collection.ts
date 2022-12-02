import * as crypto from 'crypto';
import { ApplicationError } from '../errors/application.error';
import { validateRecipe } from './recipe.validatiors';

export function createRecipesCollection(
  store: RecipesDataStore
): RecipesCollection {
  async function add(newRecipe: Recipe) {
    const validated = validateRecipe(
      Object.assign({ id: crypto.randomUUID() }, newRecipe)
    );
    const result = await store.create(validated);

    return validateRecipe(result);
  }

  async function getAll(options: any) {
    const results = await store.getAll(options);
    return results.map((result) => validateRecipe(result));
  }

  async function getById(id: string, options: any): Promise<Recipe> {
    const result = await store.getById(id, options);
    if (!result) {
      throw new ApplicationError('NotFound', `No recipe found with id: ${id}`);
    }
    return validateRecipe(result);
  }

  async function update(id: string, updatedInfo: any) {
    const validatedUpdateInfo = validateRecipe({ id, ...updatedInfo });
    delete validatedUpdateInfo.id;
    const result = await store.updateOne({ id }, validatedUpdateInfo);
    return validateRecipe(result);
  }

  async function remove(id: string) {
    return await store.remove(id);
  }

  return {
    add,
    getAll,
    getById,
    update,
    remove,
  };
}
