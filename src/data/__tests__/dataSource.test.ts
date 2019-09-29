import createInMemoryDataSource, { DataSource } from '../dataSource';
import { Cart } from '../cart';

describe('createInMemoryDataSource', () => {
  let dataSource: DataSource<Cart>;

  beforeEach(() => {
    dataSource = createInMemoryDataSource();
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
});
