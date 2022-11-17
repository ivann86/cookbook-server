interface DataStore<T> {
  create: (user: T) => Promise<T>;
  find: (filter: any, options: any) => Promise<T[]>;
  findOne: (filter: any, options: any) => Promise<T | null>;
  updateOne: (filter: any, update: T) => Promise<T>;
  updateMany: (filter: any, update: T) => Promise<T>;
  remove: (id: string) => Promise<Boolean>;
}

interface UsersDataStore extends DataStore<User> {}

interface User {
  id?: string;
  username: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UsersCollection {
  register: (user: NewUser) => Promise<User>;
  find: (filter: any, options: any) => Promise<User[]>;
  getById: (id: string) => Promise<User>;
  update: (id: string, updatedInfo: any) => Promise<User>;
  remove: (id: string) => Promise<Boolean>;
  authenticate: (username: string, password: string) => Promise<User>;
}
