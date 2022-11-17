import bcrypt from 'bcrypt';
import { validate } from './user.validator';

export function format(user: User) {
  if ('password' in user) {
    delete user.password;
  }

  return Object.freeze(user);
}

export function validateAndFormat(user: User | null) {
  return Object.freeze(format(validate(user)));
}

export async function encryptPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function checkPassword(password: string, encrypted: string) {
  return await bcrypt.compare(password, encrypted);
}
