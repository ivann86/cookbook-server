import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export function generateToken(user: User, secret: string, expiresIn: string) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign(payload, secret, { expiresIn: expiresIn });
}

export function validate(token: string, secret: string) {
  return jwt.verify(token, secret);
}

export function createAuth(store: UsersDataStore) {
  async function authenticate(
    username: string,
    password: string,
    authOption: {
      method: 'JSONWebToken' | 'SessionID';
      expiresIn: number;
      jwtSecret?: string;
    } = {
      method: 'JSONWebToken',
      expiresIn: 3600,
    }
  ) {
    const result = await store.findOne({ username }, {});
    if (!result) {
      throw new Error('Incorrect username or password');
    }
    const hashedPassword = result.password!;
    if (!(await bcrypt.compare(password, hashedPassword))) {
      throw new Error('Incorrect username or password');
    }
  }
}
