export function createUsersStore(): UsersDataStore {
  const users: User[] = [];

  async function create(user: User) {
    return new Promise<User>((resolve) => {
      users.push(user);
      resolve(user);
    });
  }

  async function findOne(filter: any, options: any) {
    return new Promise<User | null>((resolve) => {
      const result = users.find((user) => {
        for (let [key, value] of Object.entries(filter)) {
          if (key in user) {
            if (user[key as keyof User] === value) {
              return user;
            }
          }
        }
      });
      if (!result) {
        return resolve(null);
      }
      resolve(result);
    });
  }

  async function find(filter: any, options: object) {
    return new Promise<User[]>((resolve) => {
      resolve(
        users.filter((user) => {
          for (let [key, value] of Object.entries(filter)) {
            if (key in user) {
              if (user[key as keyof User] === value) {
                return user;
              }
            }
          }
        })
      );
    });
  }

  async function getByEmail(email: string, options: any) {
    const emailRegex = new RegExp(email, 'i');

    return new Promise<User | null>((resolve, reject) => {
      const result = users.find((user) => emailRegex.test(email));
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
    findOne,
    getById,
    getByEmail,
    find,
    updateOne,
    updateMany,
    remove,
  });
}
