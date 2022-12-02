import { connect, ConnectOptions } from 'mongoose';

export async function configMongoose(
  connectionString: string,
  options: ConnectOptions | undefined
) {
  await connect(connectionString, options);
}
