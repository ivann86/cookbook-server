import * as uuid from 'uuid';
import bcrypt, { compare } from 'bcrypt';
import { validate } from './user.validator';
import { generateToken } from './users.token';

declare global {
  interface UsersCollectionOptions {
    tokenSecret: string;
    tokenExpirationPeriod: string;
  }
}

export function createUsersCollection(
  store: UsersDataStore,
  options: UsersCollectionOptions
): UsersCollection {
  async function register(newUser: {
    username: string;
    email: string;
    password: string;
  }) {
    const validated = validate(newUser as User);
    if (await usernameExists(validated.username)) {
      throw new Error('Username is taken');
    }
    if (await emailExists(validated.email)) {
      throw new Error('Email is registered');
    }
    const user: User = {
      id: uuid.v4(),
      username: validated.username,
      email: validated.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: await encryptPassword(validated.password),
    };

    return validateAndFormat(await store.create(user));
  }

  async function getAll() {
    return (await store.find({}, {})).map((user) => validateAndFormat(user));
  }

  async function getById(id: string) {
    const results = await store.find({ id }, {});
    if (results.length === 0) {
      throw new Error('No such user');
    }
    return validateAndFormat(results[0]);
  }

  async function update(id: string, updatedInfo: any) {
    if ('password' in updatedInfo) {
      delete updatedInfo.password;
    }
    const currentUser = await getById(id);
    const newUser = validate(Object.assign(currentUser, updatedInfo));
    newUser.updatedAt = new Date();
    return validateAndFormat(await store.updateOne({ id }, newUser));
  }

  async function remove(id: string) {
    return await store.remove(id);
  }

  async function authenticate(username: string, password: string) {
    const result = await store.findOne({ username }, {});
    if (!result) {
      throw new Error('Incorrect username or password');
    }
    const hashedPassword = result.password!;
    if (!(await bcrypt.compare(password, hashedPassword))) {
      throw new Error('Incorrect username or password');
    }

    const token = generateToken(
      result,
      options.tokenSecret,
      options.tokenExpirationPeriod
    );

    return token;
  }

  async function usernameExists(username: string): Promise<Boolean> {
    const results = await store.find({ username }, {});
    if (results.length > 0) {
      return true;
    }
    return false;
  }

  async function emailExists(email: string): Promise<Boolean> {
    const results = await store.find({ email }, {});
    if (results.length > 0) {
      return true;
    }
    return false;
  }

  async function encryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  function format(user: User) {
    if ('password' in user) {
      delete user.password;
    }

    return Object.freeze(user);
  }

  function validateAndFormat(user: User | null) {
    return Object.freeze(format(validate(user)));
  }

  return Object.freeze({
    register,
    getAll,
    getById,
    update,
    remove,
    authenticate,
  });
}
