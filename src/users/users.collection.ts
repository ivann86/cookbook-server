import * as crypto from 'crypto';
import { DuplicationError, ValidationError } from '../errors';
import { ApplicationError } from '../errors/application.error';
import { validate } from './user.validator';
import {
  checkPassword,
  encryptPassword,
  validateAndFormat,
} from './users.utils';

export function createUsersCollection(store: UsersDataStore): UsersCollection {
  async function register(newUser: { email: string; password: string }) {
    const { email, password } = validate(newUser as User);

    // Search for existing user with the same username or e-mail addres and throw if found
    if (await store.getByEmail(email, {})) {
      throw new DuplicationError(
        `The e-mail address ${email} is already registerd`
      );
    }

    // Create the new user
    const user: User = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
      password: await encryptPassword(password),
    };

    return validateAndFormat(await store.create(user));
  }

  async function getById(id: string) {
    const result = await store.getById(id, {});
    if (!result) {
      throw new Error('No such user');
    }
    return validateAndFormat(result);
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

  async function authenticate(email: string, password: string) {
    const result = await store.getByEmail(email, {});
    if (!result) {
      throw new ApplicationError(
        'AuthorizationError',
        'Incorrect username or password'
      );
    }
    const hashedPassword = result.password!;
    if (!(await checkPassword(password, hashedPassword))) {
      throw new ApplicationError(
        'AuthorizationError',
        'Incorrect username or password'
      );
    }

    return validateAndFormat(result);
  }

  return Object.freeze({
    register,
    getById,
    update,
    remove,
    authenticate,
  });
}
