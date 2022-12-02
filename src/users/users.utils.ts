import bcrypt from 'bcrypt';
import { validateUser } from './user.validators';

export function format(user: User) {
  if ('password' in user) {
    delete user.password;
  }

  return Object.freeze(user);
}

export function outputUser(user: User) {
  return Object.freeze(format(validateUser(user)));
}

export async function encryptPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function checkPassword(password: string, encrypted: string) {
  return await bcrypt.compare(password, encrypted);
}
