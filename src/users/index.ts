export { validate } from './user.validator';
export { createUsersCollection } from './users.collection';

declare global {
  interface UsersDataStore extends DataStore<User> {
    getById: (id: string, options: any) => Promise<User | null>;
    getByEmail: (email: string, options: any) => Promise<User | null>;
  }
}

declare global {
  interface User {
    id?: string;
    email: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

declare global {
  interface UsersCollection {
    register: (newUser: { email: string; password: string }) => Promise<User>;
    find: (filter: any, options: any) => Promise<User[]>;
    getById: (id: string) => Promise<User>;
    update: (id: string, updatedInfo: any) => Promise<User>;
    remove: (id: string) => Promise<Boolean>;
    authenticate: (username: string, password: string) => Promise<User>;
  }
}
