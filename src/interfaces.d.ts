interface DataStore<T> {
  create: (object: T) => Promise<T>;
  getById: (id: string, options: any) => Promise<T | null>;
  getAll: (options: any) => Promise<T[]>;
  updateOne: (filter: any, update: T) => Promise<T>;
  updateMany: (filter: any, update: T) => Promise<Array<T>>;
  remove: (id: string) => Promise<Boolean>;
}
