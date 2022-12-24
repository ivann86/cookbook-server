import { ApplicationError } from '../errors/application.error';
import { Token } from './token.model';

export function createInvalidTokensStore(): InvalidTokensStore {
  const store: { token: string; expireAt: Date }[] = [];

  async function insert(token: string, expireAt: Date) {
    try {
      await Token.create({ token, expireAt });
    } catch (err) {
      throw new ApplicationError('DatabaseError', 'Could not create token document');
    }
  }

  async function check(token: string) {
    try {
      if (await Token.findOne({ token })) {
        return true;
      }
      return false;
    } catch (err) {
      throw new ApplicationError('DatabaseError', 'Could not perform token search');
    }
  }

  return Object.freeze({
    insert,
    check,
  });
}
