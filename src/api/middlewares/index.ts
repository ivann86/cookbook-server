export { bearerToken } from './bearer-token.middleware';

declare global {
  interface InvalidTokensStore {
    insert(token: string, expireAt: Date): Promise<void>;
    isBlacklisted(token: string): Promise<Boolean>;
  }
}
