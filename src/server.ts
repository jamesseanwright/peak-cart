import express from 'express';
import bodyParser from 'body-parser';
import { DataStore, isPopulated } from './data/dataStore';
import { Cart, cartStore } from './data/cart';
import { Item, createItemStore } from './data/item';

const createErrorBody = (errorMessage: string) => ({
  errorMessage,
});

const createCartRouter = (carts: DataStore<Cart>, items: DataStore<Item>) => {
  const cartRouter = express.Router();

  cartRouter.post('/', async (req, res) => {
    const { id } = await carts.save({ items: [] });

    res.status(201).json({ id });
  });

  cartRouter.get('/:id/items', async (req, res) => {
    const { hasRecord: hasCart, record: cart } = await carts.getById(req.params.id);

    if (!isPopulated(hasCart, cart)) {
      res.status(404).json(createErrorBody('Cart not found'));
      return;
    }

    const itemRetrievals = await Promise.all(
      cart.model.items.map(({ id }) => items.getById(id)),
    );

    const response = itemRetrievals.map(({ record }) => (record || {}).model);

    res.status(200).json(response);
  });

  cartRouter.patch('/:id/items', async (req, res) => {
    const { hasRecord: hasCart, record: cart } = await carts.getById(req.params.id);

    if (!isPopulated(hasCart, cart)) {
      res.status(404).json(createErrorBody('Cart not found'));
      return;
    }

    const { hasRecord: hasItem, record: item } = await items.getById(req.body.id);

    if (!isPopulated(hasItem, item)) {
      res.status(400).json(createErrorBody('Item not found'));
      return;
    }

    const nextCart = {
      items: [
        ...cart.model.items,
        { id: item.id },
      ],
    };

    await carts.save(nextCart, cart.id);

    res.status(200).json({});
  });

  cartRouter.put('/:id/items', async (req, res) => {

  });

  return cartRouter;
};

const createServer = () => {
  const server = express();

  server.use(bodyParser.json());

  server.use(
    '/carts',
    createCartRouter(cartStore, createItemStore()),
  );

  return server;
};

export default createServer;
