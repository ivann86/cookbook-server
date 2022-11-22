import * as crypto from 'crypto';
import { DuplicationError } from '../errors';
import { ApplicationError } from '../errors/application.error';
import {
  validateUser,
  validateUserCredentials,
  validateUserRegistrationData,
} from './user.validators';
import {
  checkPassword,
  encryptPassword,
  validateAndFormat,
} from './users.utils';

export function createUsersCollection(store: UsersDataStore): UsersCollection {
  async function register(newUser: UserRegistrationData) {
    const { email, password, firstName, lastName } =
      validateUserRegistrationData(newUser);

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
      firstName,
      lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: await encryptPassword(password),
    };

    return validateAndFormat(await store.create(user));
  }

  async function getAll(options: any) {
    return (await store.getAll(options)).map((user) => validateAndFormat(user));
  }

  async function getById(id: string) {
    const result = await store.getById(id, {});
    if (!result) {
      throw new ApplicationError('NotFound', `No user found with id: ${id}`);
    }
    return validateAndFormat(result);
  }

  async function getByEmail(email: string) {
    const result = await store.getByEmail(email, {});
    if (!result) {
      throw new ApplicationError(
        'NotFound',
        `No user found with e-mail: ${email}`
      );
    }
    return result;
  }

  async function update(id: string, updatedInfo: any) {
    if ('password' in updatedInfo) {
      delete updatedInfo.password;
    }
    const currentUser = await getById(id);
    const newUser = validateUser(Object.assign(currentUser, updatedInfo));
    newUser.updatedAt = new Date();
    return validateAndFormat(await store.updateOne({ id }, newUser));
  }

  async function remove(id: string) {
    return await store.remove(id);
  }

  async function authenticate(credentials: UserCredentials) {
    let email = '';
    let password = '';
    try {
      ({ email, password } = validateUserCredentials(credentials));
    } catch (err) {
      throw new ApplicationError(
        'AuthorizationError',
        'Incorrect username or password'
      );
    }
    const result = await store.getByEmail(email, {});

    if (!result) {
      throw new ApplicationError(
        'AuthorizationError',
        'Incorrect username or password'
      );
    }

    const hashedPassword = result.password || '';
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
    getAll,
    getById,
    getByEmail,
    update,
    remove,
    authenticate,
  });
}
