export * from './recipe.validatiors';
export * from './recipes.collection';

declare global {
  interface Recipe {
    id: string;
    name: string;
    imgUrl: string;
    imgSmallUrl: string;
    description: string;
    ingredients: Ingredient[];
    steps: string[];
    prepTimeInSeconds: number;
    portions: number;
    nationality: string;
    categories: string[];
    tags: string[];
  }

  interface Ingredient {
    name: string;
    quantity: number;
    units: string;
  }

  interface RecipesDataStore extends DataStore<Recipe> {}

  interface RecipesCollection {
    add: (newRecipe: Recipe) => Promise<Recipe>;
    getAll: (options: any) => Promise<Recipe[]>;
    getById: (id: string, options: any) => Promise<Recipe>;
    update: (id: string, updatedInfo: any) => Promise<Recipe>;
    remove: (id: string) => Promise<Boolean>;
  }
}
