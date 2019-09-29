import express from 'express';
import createInMemoryDataStore, { DataStore } from './data/dataStore';
import { Cart } from './data/cart';

const createCartRouter = (carts: DataStore<Cart>) => {
  const cartRouter = express.Router();

  cartRouter.post('/', async (req, res) => {
    const { id } = await carts.save({ items: [] });

    res.status(201).json({ id });
  });

  return cartRouter;
};

const createServer = () => {
  const server = express();

  server.use(
    '/carts',
    createCartRouter(
      createInMemoryDataStore<Cart>(),
    ),
  );

  return server;
};

export default createServer;
