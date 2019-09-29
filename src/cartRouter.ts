import express from 'express';
import { DataStore, isPopulated } from './data/dataStore';
import { Cart } from './data/cart';
import { Item } from './data/item';

const createErrorMessageBody = (errorMessage: string) => ({
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
      res.status(404).json(createErrorMessageBody('Cart not found'));
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
      res.status(404).json(createErrorMessageBody('Cart not found'));
      return;
    }

    const { hasRecord: hasItem, record: item } = await items.getById(req.body.id);

    if (!isPopulated(hasItem, item)) {
      res.status(400).json(createErrorMessageBody('Item not found'));
      return;
    }

    const nextCart = {
      items: [
        ...cart.model.items,
        { id: item.id },
      ],
    };

    await carts.save(nextCart, cart.id);

    res.status(204).send();
  });

  cartRouter.put('/:id/items', async (req, res) => {
    const { hasRecord: hasCart, record: cart } = await carts.getById(req.params.id);

    if (!isPopulated(hasCart, cart)) {
      res.status(404).json(createErrorMessageBody('Cart not found'));
      return;
    }

    if (req.body.items.length > 0) {
      res.status(400).json(createErrorMessageBody('Items array must be empty'));
      return;
    }

    const nextCart = {
      items: [],
    };

    await carts.save(nextCart, cart.id);

    res.status(204).send();
  });

  return cartRouter;
};

export default createCartRouter;
