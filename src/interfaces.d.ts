interface DataService<T> {
  create: (user: T) => Promise<T>;
  find: (filter: any, options: any) => Promise<T[]>;
  update: (id: string, updatedUser: T) => Promise<T>;
  remove: (id: string) => Promise<Boolean>;
}

interface UsersDataExtras {}

type UsersDataService = DataService<User> & UsersDataExtras;

interface User {
  id?: string;
  username: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NewUser {
  username: string;
  email: string;
  password: string;
}

interface UsersCollection {
  register: (user: NewUser) => Promise<User>;
  findById: (id: string) => Promise<User>;
  update: (id: string, updatedInfo: any) => Promise<User>;
  remove: (id: string) => Promise<Boolean>;
  authenticate: (username: string, password: string) => Promise<User>;
}
