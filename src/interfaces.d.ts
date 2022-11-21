interface DataStore<T> {
  create: (user: T) => Promise<T>;
  getAll: (options: any) => Promise<T[]>;
  updateOne: (filter: any, update: T) => Promise<T>;
  updateMany: (filter: any, update: T) => Promise<T>;
  remove: (id: string) => Promise<Boolean>;
}
