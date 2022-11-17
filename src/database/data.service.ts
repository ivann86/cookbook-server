import { any } from 'joi';

export function createUsersStore(): UsersDataStore {
  const users: User[] = [];

  async function create(user: User) {
    return new Promise<User>((resolve) => {
      users.push(user);
      resolve(user);
    });
  }

  async function findOne(filter: any, options: any) {
    return new Promise<User>(() => {});
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
    find,
    updateOne,
    updateMany,
    remove,
  });
}
