export * from './recipe.validatiors';
export * from './recipes.collection';

declare global {
  interface Recipe {
    id: string;
    name: string;
    slug: string;
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
    owner: string | User;
  }

  interface Ingredient {
    name: string;
    quantity: number;
    units: string;
  }

  interface RecipesDataStore extends DataStore<Recipe> {
    getByName(name: string, options: any): Promise<Recipe | null>;
    getBySlug(slug: string, options: any): Promise<Recipe | null>;
    getTagSample(tags: string[], size: number): Promise<Recipe[]>;
  }

  interface RecipesCollection {
    add: (newRecipe: Recipe) => Promise<Recipe>;
    get: (filter: any, options: any) => Promise<Recipe[]>;
    getAll: (options: any) => Promise<Recipe[]>;
    getTagSample(tags: string[], size: number): Promise<Recipe[]>;
    getById: (id: string, options: any) => Promise<Recipe>;
    getBySlug: (id: string, options: any) => Promise<Recipe>;
    search: (search: string, options: any) => Promise<Recipe[]>;
    update: (id: string, updatedInfo: any) => Promise<any>;
    remove: (filter: any) => Promise<void>;
    count: (search: string, filter: any) => Promise<number>;
  }
}
