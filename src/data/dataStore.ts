import uuid from 'uuid/v4';

export interface Entity {
  id: string;
}

export interface Record<TModel> extends Entity {
  model: TModel;
}

export class MissingRecordError extends Error {
  constructor(id?: string) {
    super(`Cannot find record with ID "${id}"`);
  }

  get httpStatus() {
    return 404;
  }
}

/* Note that we use Promises for
 * all implementations, so we can
 * easily replace the in-memory
 * data source with an async connector
 * without having to refactor all of
 * the call sites across the app. */
export interface DataStore<TModel> {
  getById(id: string): Promise<Record<TModel>>;
  save(data: TModel, id?: string): Promise<Record<TModel>>;
}

const createInMemoryDataStore = <TModel>(): DataStore<TModel> => {
  const records = new Map<string, Record<TModel>>();

  return {
    getById(id: string) {
      return records.has(id)
        ? Promise.resolve(records.get(id)!)
        : Promise.reject(new MissingRecordError(id));
    },

    save(model: TModel, id = uuid()) {
      const record = {
        id,
        model,
      };

      records.set(id, record);

      return Promise.resolve(record);
    },
  };
};

export default createInMemoryDataStore;
