import createInMemoryDataStore, { DataStore, MissingRecordError } from '../dataStore';
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
      const retrievedRecord = await dataSource.getById(savedRecord.id);

      expect(savedRecord.model.items).toBe(cart.items);
      expect(savedRecord).toBe(retrievedRecord);
    });
  });

  describe('getById', () => {
    it('should reject with an error if the record could not be found', () => {
      return dataSource.getById('no')
        .catch(e => {
          expect(e).toBeInstanceOf(MissingRecordError);
          expect(e.message).toBe('Cannot find record with ID "no"');
        });
    });
  });
});
