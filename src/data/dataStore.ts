import uuid from 'uuid/v4';

export interface Record<TModel> {
  id: string;
  model: TModel;
}

export interface Retrieval<TModel> {
  hasRecord: boolean;
  record?: Record<TModel>;
}

/* Note that we use Promises for
 * all implementations, so we can
 * easily replace the in-memory
 * data source with another connector
 * without having to refactor all of
 * the call sites across the app. */
export interface DataStore<TModel> {
  getById(id: string): Promise<Retrieval<TModel>>;
  save(data: TModel, id?: string): Promise<Record<TModel>>;
}

/* Workaround to avoid '!' operator when
 * asserting presence of retrieval result */
export const isPopulated = <TModel>(hasRecord: boolean, record?: Record<TModel>): record is Record<TModel> =>
  hasRecord;

const createInMemoryDataStore = <TModel>(): DataStore<TModel> => {
  const records = new Map<string, Record<TModel>>();

  return {
    getById(id: string) {
      const record = records.get(id);

      return Promise.resolve({
        hasRecord: !!record,
        record,
      });
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
