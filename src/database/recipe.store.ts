import { createDataStore } from './data.store';
import { Recipe } from './recipe.model';

export function createRecipeStore(): RecipesDataStore {
  async function getByName(name: string, options: any = {}) {
    return (await Recipe.findOne({ name: new RegExp(name, 'i') }, options))?.toObject() || null;
  }

  async function getBySlug(slug: string, options: any) {
    return (await Recipe.findOne({ slug: new RegExp(slug, 'i') }, options))?.toObject() || null;
  }

  async function getTagSample(tags: string[], size: number) {
    const aggregation = [];
    if (tags.length) {
      aggregation.push({ $match: { tags: { $all: tags.map((tag) => new RegExp(tag, 'i')) } } });
    }
    aggregation.push({ $sample: { size } });
    const results = await Recipe.aggregate(aggregation);
    return (await Recipe.populate(results, 'owner')).map((result) => {
      result.owner = (result.owner as any).toObject();
      result.id = result._id;
      return result;
    });
  }

  return Object.freeze(
    Object.assign(
      {
        getByName,
        getBySlug,
        getTagSample,
      },
      createDataStore<Recipe>(Recipe)
    )
  );
}
