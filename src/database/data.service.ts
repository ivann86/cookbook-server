export function createUsersStore(): UsersDataStore {
  const users: User[] = [];

  async function create(user: User) {
    return new Promise<User>((resolve) => {
      users.push(user);
      resolve(user);
    });
  }

  async function getAll(options: any) {
    return Promise.resolve(users);
  }

  async function getByEmail(email: string, options: any) {
    const emailRegex = new RegExp(email, 'i');

    return new Promise<User | null>((resolve, reject) => {
      const result = users.find((user) => emailRegex.test(user.email));
      if (result) {
        return resolve(result);
      }
      return resolve(null);
    });
  }

  async function getById(id: string, options: any) {
    const result = users.find((user) => user.id === id);
    return Promise.resolve(result || null);
  }

  async function updateOne(filter: any, update: User) {
    return new Promise<User>(() => {});
  }

  async function updateMany(filter: any, update: User) {
    return new Promise<User>(() => {});
  }

  async function remove(id: string) {
    return new Promise<Boolean>(() => {});
  }

  return Object.freeze({
    create,
    getAll,
    getById,
    getByEmail,
    updateOne,
    updateMany,
    remove,
  });
}
