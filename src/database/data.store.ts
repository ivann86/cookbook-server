import * as mongoose from 'mongoose';

export function createDataStore<T>(model: mongoose.Model<any, any, any, any, any>): DataStore<T> {
  async function create(object: T) {
    const doc = new model(object);
    doc._id = (object as any).id;
    return (await doc.save()).toObject();
  }

  async function getAll(options: any) {
    return ((await model.find()) as any[]).map((item) => item.toObject());
  }

  async function getById(id: string, options: any) {
    return (await model.findById(id))?.toObject();
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
