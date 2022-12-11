interface DataStore<T> {
  create: (object: T) => Promise<T>;
  get: (filter: any, options: any) => Promise<Recipe[]>;
  getById: (id: string, options: any) => Promise<T | null>;
  getAll: (options: any) => Promise<T[]>;
  updateOne: (filter: any, update: T) => Promise<T>;
  updateMany: (filter: any, update: T) => Promise<Array<T>>;
  remove: (filter: any) => Promise<void>;
  count: (filter: any) => Promise<number>;
}
