import { createDataStore } from './data.store';
import { User } from './user.model';

export function createUserStore(): UsersDataStore {
  async function getByEmail(email: string, options: any) {
    const result = await User.findOne({ email });
    if (result) {
      return result.toObject();
    }
    return null;
  }

  return Object.freeze(Object.assign({ getByEmail }, createDataStore<User>(User)));
}
