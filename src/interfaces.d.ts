interface DataStore<T> {
  create: (user: T) => Promise<T>;
  find: (filter: any, options: any) => Promise<T[]>;
  findOne: (filter: any, options: any) => Promise<T | null>;
  updateOne: (filter: any, update: T) => Promise<T>;
  updateMany: (filter: any, update: T) => Promise<T>;
  remove: (id: string) => Promise<Boolean>;
}
