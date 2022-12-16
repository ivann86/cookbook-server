import * as mongoose from 'mongoose';

export function createDataStore<T>(model: mongoose.Model<any, any, any, any, any>): DataStore<T> {
  async function create(object: T) {
    const doc = new model(object);
    doc._id = (object as any).id;
    return (await doc.save()).toObject();
  }

  async function getAll(options: any) {
    return ((await model.find({}, null, options)) as any[]).map((item) => item.toObject());
  }

  async function getById(id: string, options: any) {
    return (await model.findById(id))?.toObject();
  }

  async function get(filter: any, options: any) {
    return ((await model.find(formatFilter(filter), null, options)) as any[]).map((item) => item.toObject());
  }

  async function search(search: string, options: any) {
    return ((await model.find({ $text: { $search: search } }, null, options)) as any[]).map((item) => item.toObject());
  }

  async function updateOne(filter: any, update: any) {
    return await model.updateOne(formatFilter(filter), update);
  }

  async function updateMany(filter: any, update: any) {
    return await model.updateMany(formatFilter(filter), update);
  }

  async function remove(filter: any) {
    return await model.findOneAndRemove(formatFilter(filter));
  }

  async function count(search: string, filter: any) {
    if (!search) {
      return await model.find(formatFilter(filter)).count();
    }

    return await model.find({ $text: { $search: search } }).count();
  }

  function formatFilter(filter: any) {
    for (let key in filter) {
      if (Array.isArray(filter[key])) {
        filter[key] = { $all: (filter[key] as string[]).map((value) => new RegExp(value, 'i')) };
      }
    }
    return filter;
  }

  return Object.freeze({
    create,
    getAll,
    getById,
    get,
    search,
    updateOne,
    updateMany,
    remove,
    count,
  });
}
