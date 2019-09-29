import createInMemoryDataStore, { DataStore } from '../dataStore';
import { Cart } from '../cart';

describe('createInMemoryDataStore', () => {
  let dataSource: DataStore<Cart>;

  beforeEach(() => {
    dataSource = createInMemoryDataStore();
  });

  describe('save and getById', () => {
    it('should save the data, along with the generated ID, to memory', async () => {
      const cart = {
        items: [],
      };

      const savedRecord = await dataSource.save(cart);
      const retrieval = await dataSource.getById(savedRecord.id);

      expect(savedRecord.model.items).toBe(cart.items);
      expect(savedRecord).toBe(retrieval.record);
    });
  });

  describe('getById', () => {
    it('should return a retrieval with no record if the ID could not be found', async () => {
      const retrieval = await dataSource.getById('no');

      expect(retrieval.hasRecord).toBe(false);
      expect(retrieval.record).toBeUndefined();
    });
  });
});
