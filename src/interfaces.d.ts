interface DataService {
  create: (user: User) => Promise<User>;
  find: (filter: any, options: object) => Promise<User[]>;
  update: (id: string, updatedUser: User) => Promise<User>;
  remove: (id: string) => Promise<Boolean>;
}

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
  create: (user: NewUser) => Promise<User>;
  findById: (id: string) => Promise<User>;
  update: (id: string, updatedInfo: any) => Promise<User>;
  remove: (id: string) => Promise<Boolean>;
  authenticate: (username: string, password: string) => Promise<User>;
}

interface AuthController {
  register: import('express').RequestHandler;
  login: import('express').RequestHandler;
  logout: import('express').RequestHandler;
}
