// TODO: better name to suggest writing?

export interface Model {
  id: string;
}

/* Note that we use Promises for
 * all implementations, so we can
 * easily replace the in-memory
 * data source with another connector
 * without having to refactor all of
 * the call sites across the app. */
export interface DataSource<TModel extends Model> {
  getById(id: string): Promise<TModel>;
  save(data: Omit<TModel, 'id'>): Promise<TModel>;
}

const createInMemoryDataSource = <TModel extends Model>(): DataSource<TModel> => {
  return {
    getById: (id: string) => Promise.resolve({} as TModel),
    save: (data: Omit<TModel, 'id'>) => Promise.resolve({} as TModel),
  };
};

export default createInMemoryDataSource;
