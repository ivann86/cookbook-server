export function dataService(): UsersDataService {
  const users: User[] = [];

  async function create(user: User) {
    return new Promise<User>((resolve) => {
      users.push(user);
      resolve(user);
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

  async function update(id: string, updatedUser: User) {
    return new Promise<User>(() => {});
  }

  async function remove(id: string) {
    return new Promise<Boolean>(() => {});
  }

  return Object.freeze({
    create,
    find,
    update,
    remove,
  });
}
