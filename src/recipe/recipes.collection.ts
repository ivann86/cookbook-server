import * as crypto from 'crypto';
import { DuplicationError } from '../errors';
import { ApplicationError } from '../errors/application.error';
import { validateRecipe } from './recipe.validatiors';

export function createRecipesCollection(store: RecipesDataStore): RecipesCollection {
  async function add(newRecipe: Recipe) {
    const validated = validateRecipe(Object.assign({ id: crypto.randomUUID() }, newRecipe));
    // Check for name duplication
    if (await store.getByName(validated.name, {})) {
      throw new DuplicationError(`There is a recipe with the same name already`);
    }
    validated.createdAt = new Date();
    validated.updatedAt = new Date();
    const result = await store.create(validated);
    return validateRecipe(result);
  }

  async function getAll(options: any) {
    const results = await store.getAll(options);
    return results.map((result) => validateRecipe(result));
  }

  async function getTagSample(tags: string[], size: number) {
    const results = await store.getTagSample(tags, size);
    return results.map((result) => validateRecipe(result));
  }

  async function getById(id: string, options: any): Promise<Recipe> {
    const result = await store.getById(id, options);
    if (!result) {
      throw new ApplicationError('NotFound', `No recipe found with id: ${id}`);
    }
    return validateRecipe(result);
  }

  async function getBySlug(slug: string, options: any): Promise<Recipe> {
    const result = await store.getBySlug(slug, options);
    if (!result) {
      throw new ApplicationError('NotFound', `No recipe found for ${slug}`);
    }
    return validateRecipe(result);
  }

  async function get(filter: any, options: any) {
    const results = await store.get(filter, options);
    return results.map((result) => validateRecipe(result));
  }

  async function search(search: string, options: any) {
    const results = await store.search(search, options);
    return results.map((result) => validateRecipe(result));
  }

  async function update(slug: string, updatedInfo: any) {
    const update: any = { slug, ...updatedInfo };
    const validatedUpdateInfo = validateRecipe(update);
    update.updatedAt = new Date();
    await store.updateOne({ slug }, validatedUpdateInfo);
  }

  async function remove(filter: any) {
    await store.remove(filter);
  }

  async function count(search: string, filter: any) {
    return await store.count(search, filter);
  }

  return {
    add,
    getAll,
    getById,
    getBySlug,
    getTagSample,
    get,
    search,
    update,
    remove,
    count,
  };
}
