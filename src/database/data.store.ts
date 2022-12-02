import * as mongoose from 'mongoose';

export function createDataStore<T>(
  model: mongoose.Model<any, any, any, any, any>
): DataStore<T> {
  async function create(object: T): Promise<T> {
    return (await model.create(object)) as T;
  }

  async function getAll(options: any) {
    return await model.find({});
  }

  async function getById(id: string, options: any) {
    return await model.findById(id);
  }

  async function updateOne(filter: any, update: any) {
    return await model.updateOne(filter, update);
  }

  async function updateMany(filter: any, update: any) {
    return await model.updateMany(filter, update);
  }

  async function remove(id: string) {
    return await model.findByIdAndRemove(id);
  }

  return Object.freeze({
    create,
    getAll,
    getById,
    updateOne,
    updateMany,
    remove,
  });
}
