export { validate } from './user.validator';
export { createUsersCollection } from './users.collection';

declare global {
  interface UsersDataStore extends DataStore<User> {}
}

declare global {
  interface User {
    id?: string;
    username: string;
    email: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

declare global {
  interface UsersCollection {
    register: (newUser: {
      username: string;
      email: string;
      password: string;
    }) => Promise<User>;
    find: (filter: any, options: any) => Promise<User[]>;
    getById: (id: string) => Promise<User>;
    update: (id: string, updatedInfo: any) => Promise<User>;
    remove: (id: string) => Promise<Boolean>;
    authenticate: (username: string, password: string) => Promise<User>;
  }
}
