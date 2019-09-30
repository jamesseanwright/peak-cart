import express, { Request, Response } from 'express';
import { DataStore } from './data/dataStore';
import { Cart } from './data/cart';
import { Item } from './data/item';
import { Logger } from './server';
import promiseRouteCreator from './promiseRoute';

export class BadRequestError extends Error {
  get httpStatus() {
    return 400;
  }
}

/* There are some instances in which
 * we need to report a different error
 * to the one we have received. */
const mapToError = (ErrorConstructor: new (message: string) => Error) => (
  e: Error,
) => Promise.reject(new ErrorConstructor(e.message));

const validateEmptyItems = (items: never[]) =>
  items.length === 0
    ? Promise.resolve()
    : Promise.reject(new BadRequestError('Items array must be empty'));

const createCartRouter = (
  logger: Logger,
  carts: DataStore<Cart>,
  items: DataStore<Item>,
) => {
  const cartRouter = express.Router();
  const promiseRoute = promiseRouteCreator(logger);

  cartRouter.post(
    '/',
    promiseRoute((req, res) =>
      carts.save({ items: [] }).then(({ id }) => res.status(201).json({ id })),
    ),
  );

  cartRouter.get(
    '/:id/items',
    promiseRoute((req, res) =>
      carts
        .getById(req.params.id)
        .then(cart =>
          Promise.all(cart.model.items.map(({ id }) => items.getById(id))),
        )
        .then(records =>
          records.map(({ id, model }) => ({
            id,
            ...model,
          })),
        )
        .then(items => res.status(200).json(items)),
    ),
  );

  cartRouter.patch(
    '/:id/items',
    promiseRoute((req, res) =>
      Promise.all([
        carts.getById(req.params.id),
        items.getById(req.body.itemId).catch(mapToError(BadRequestError)),
      ])
        .then(([cart, { id }]) =>
          carts.save(
            {
              items: [...cart.model.items, { id }],
            },
            cart.id,
          ),
        )
        .then(() => res.status(204).send()),
    ),
  );

  cartRouter.put(
    '/:id/items',
    promiseRoute((req, res) =>
      Promise.all([
        carts.getById(req.params.id),
        validateEmptyItems(req.body.itemIds),
      ])
        .then(([{ id }]) =>
          carts.save(
            {
              items: [],
            },
            id,
          ),
        )
        .then(() => res.status(204).send()),
    ),
  );

  cartRouter.delete(
    '/:id/items/:itemId',
    promiseRoute((req, res) =>
      Promise.all([
        carts.getById(req.params.id),
        items.getById(req.params.itemId).catch(mapToError(BadRequestError)),
      ])
        .then(([{ id, model }]) =>
          carts.save(
            {
              items: model.items.filter(item => item.id !== req.params.itemId),
            },
            id,
          ),
        )
        .then(() => res.status(204).send()),
    ),
  );

  return cartRouter;
};

export default createCartRouter;
