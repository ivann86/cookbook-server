export function createInvalidTokensStore(): InvalidTokensStore {
  const store: { token: string; expireAt: Date }[] = [];

  function insert(token: string, expireAt: Date) {
    store.push({ token, expireAt });
    return Promise.resolve();
  }

  function isBlacklisted(token: string) {
    const result = store.find((item) => item.token === token);
    if (result) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  return Object.freeze({
    insert,
    isBlacklisted,
  });
}
