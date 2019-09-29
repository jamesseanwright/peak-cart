import express from 'express';
import { DataStore, isPopulated } from './data/dataStore';
import { Cart, cartStore } from './data/cart';

const createErrorBody = (errorMessage: string) => ({
  errorMessage,
});

const createCartRouter = (carts: DataStore<Cart>) => {
  const cartRouter = express.Router();

  cartRouter.post('/', async (req, res) => {
    const { id } = await carts.save({ items: [] });

    res.status(201).json({ id });
  });

  cartRouter.get('/:id/items', async (req, res) => {
    const { hasRecord, record } = await carts.getById(req.params.id);

    if (isPopulated(hasRecord, record)) {
      res.status(200).json(record.model.items);
    } else {
      res.status(404).json(createErrorBody('Cart not found'));
    }
  });

  return cartRouter;
};

const createServer = () => {
  const server = express();

  server.use(
    '/carts',
    createCartRouter(cartStore),
  );

  return server;
};

export default createServer;
