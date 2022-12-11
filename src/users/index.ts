export * from './user.validators';
export * from './users.collection';

declare global {
  interface UsersDataStore extends DataStore<User> {
    getByEmail: (email: string, options: any) => Promise<User | null>;
  }

  interface User {
    id: string;
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  interface UserRegistrationData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }

  interface UserCredentials {
    email: string;
    password: string;
  }

  interface UsersCollection {
    register: (newUser: UserRegistrationData) => Promise<User>;
    getAll: (options: any) => Promise<User[]>;
    getById: (id: string, options: any) => Promise<User>;
    getByEmail: (email: string) => Promise<User>;
    update: (id: string, updatedInfo: any) => Promise<User>;
    remove: (id: string) => Promise<void>;
    authenticate: (credentials: UserCredentials) => Promise<User>;
  }
}
