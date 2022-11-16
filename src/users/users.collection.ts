import * as uuid from 'uuid';
import bcrypt from 'bcrypt';
import { validate } from './user.validator';

export function UsersCollection(dataService: DataService): UsersCollection {
  async function create(newUser: NewUser) {
    const validated = validate(newUser as User);
    console.log('Checking if username or email exists ');
    if (await usernameExists(validated.username)) {
      throw new Error('Username is taken');
    }
    if (await emailExists(validated.email)) {
      throw new Error('Email is registered');
    }
    console.log('checked');
    const user: User = {
      id: uuid.v4(),
      username: validated.username,
      email: validated.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: await encryptPassword(validated.password),
    };

    return validateAndFormat(await dataService.create(user));
  }

  async function findById(id: string) {
    const results = await dataService.find({ id }, {});
    if (results.length === 0) {
      throw new Error('No such user');
    }
    return validateAndFormat(results[0]);
  }

  async function update(id: string, updatedInfo: any) {
    if ('password' in updatedInfo) {
      delete updatedInfo.password;
    }
    const currentUser = await findById(id);
    const newUser = validate(Object.assign(currentUser, updatedInfo));
    newUser.updatedAt = new Date();
    return validateAndFormat(await dataService.update(id, newUser));
  }

  async function remove(id: string) {
    return await dataService.remove(id);
  }

  async function usernameExists(username: string): Promise<Boolean> {
    const results = await dataService.find({ username }, {});
    if (results.length > 0) {
      return true;
    }
    return false;
  }

  async function emailExists(email: string): Promise<Boolean> {
    const results = await dataService.find({ email }, {});
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
    create,
    findById,
    update,
    remove,
  });
}
