import createInMemoryDataSource, { DataSource } from '../dataSource';
import { Cart } from '../cart';

describe('createInMemoryDataSource', () => {
  let dataSource: DataSource<Cart>;

  beforeEach(() => {
    dataSource = createInMemoryDataSource();
  });

  describe('save and get', () => {
    it('should save the data, along with the generated ID, to memory', async () => {
      const cart = {
        items: [],
      };

      const savedModel = await dataSource.save(cart);
      const retrivedModel = await dataSource.getById(savedModel.id);

      expect(savedModel.items).toBe(cart.items);
      expect(savedModel).toBe(retrivedModel);
    });
  });
});
