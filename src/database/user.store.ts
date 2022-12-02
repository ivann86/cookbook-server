import { createDataStore } from './data.store';
import { User } from './user.model';

export function createUserStore(): UsersDataStore {
  async function getByEmail(email: string, options: any) {
    return await User.findOne({ email });
  }

  return Object.freeze(
    Object.assign({ getByEmail }, createDataStore<User>(User))
  );
}
