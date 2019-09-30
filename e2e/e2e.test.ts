import { Application } from 'express';
import request from 'supertest';
import createServer from '../src/server';
import { Entity } from '../src/data/dataStore';
import { Item } from '../src/data/item';

const uuidFormat = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/i;

const createCart = (server: Application) =>
  request(server)
    .post('/carts')
    .set('Accept', 'application/json')
    .then(({ status, body }) => ({
      status,
      body: body as Entity,
    }));

const getCartItems = (server: Application, id: string) =>
  request(server)
    .get(`/carts/${id}/items`)
    .set('Accept', 'application/json')
    .then(({ status, body }) => ({
      status,
      body: body as Item[],
    }));

const addToCart = (server: Application, cartId: string, itemId: string) =>
  request(server)
    .patch(`/carts/${cartId}/items`)
    .send({ id: itemId })
    .set('Accept', 'application/json');

const replaceCartItems = (
  server: Application,
  cartId: string,
  itemIds: string[],
) =>
  request(server)
    .put(`/carts/${cartId}/items`)
    .send({ items: itemIds })
    .set('Accept', 'application/json');

const removeFromCart = (server: Application, cartId: string, itemId: string) =>
  request(server)
    .delete(`/carts/${cartId}/items/${itemId}`)
    .set('Accept', 'application/json');

describe('Cart API', () => {
  let server: Application;

  beforeEach(() => {
    server = createServer();
  });

  describe('/carts', () => {
    it('should create a new cart when the endpoint is requested with HTTP POST', async () => {
      const { status, body } = await createCart(server);

      expect(status).toBe(201);
      expect(body.id).toMatch(uuidFormat);
    });
  });

  describe('/carts/:id/items', () => {
    it('should add an item to the cart when requested with HTTP PATCH', async () => {
      const { body } = await createCart(server);
      const addItemResponse = await addToCart(
        server,
        body.id,
        'a9e9c933-eda2-4f45-92c0-33d6c1b495d8',
      );

      expect(addItemResponse.status).toBe(204);

      const getItemsResponse = await getCartItems(server, body.id);

      expect(getItemsResponse.status).toBe(200);

      expect(getItemsResponse.body as Item[]).toEqual([
        {
          title: 'The Testaments',
          price: {
            currencyCode: 'GBP',
            amount: '10.00',
          },
        },
      ]);
    });

    it('should response with an empty array when it contains no items and requested with HTTP GET', async () => {
      const { body } = await createCart(server);
      const itemsResponse = await getCartItems(server, body.id);

      expect(itemsResponse.status).toBe(200);
      expect(itemsResponse.body as Item[]).toEqual([]);
    });

    it('should remove all items when requested with HTTP PUT and an empty array in the body', async () => {
      const { body } = await createCart(server);
      const addItemResponse = await addToCart(
        server,
        body.id,
        'a9e9c933-eda2-4f45-92c0-33d6c1b495d8',
      );

      expect(addItemResponse.status).toBe(204);

      const postAddToCartResponse = await getCartItems(server, body.id);

      expect(postAddToCartResponse.status).toBe(200);
      expect((postAddToCartResponse.body as Item[])[0].title).toBe(
        'The Testaments',
      );

      const clearItemsResponse = await replaceCartItems(server, body.id, []);

      expect(clearItemsResponse.status).toBe(204);

      const postClearCartResponse = await getCartItems(server, body.id);

      expect(postClearCartResponse.status).toBe(200);
      expect((postClearCartResponse.body as Item[]).length).toBe(0);
    });

    it('should respond with HTTP 400 when requested with HTTP PUT and a non-empty array', async () => {
      const { body } = await createCart(server);
      const clearItemsResponse = await replaceCartItems(server, body.id, [
        'some_id',
      ]);

      expect(clearItemsResponse.status).toBe(400);
    });

    it('should respond with HTTP 404 when the cart cannot be found', async () => {
      const itemsResponse = await getCartItems(server, 'missing_cart_id');

      expect(itemsResponse.status).toBe(404);
    });

    it('should respond with HTTP 400 when the item to add is unrecognised', async () => {
      const { body } = await createCart(server);
      const addItemResponse = await addToCart(server, body.id, 'foo');

      expect(addItemResponse.status).toBe(400);
    });
  });

  describe('/carts/:id/items/:id', () => {
    it('should remove the item from the cart when requested with HTTP DELETE', async () => {
      const { body } = await createCart(server);

      await addToCart(server, body.id, 'a9e9c933-eda2-4f45-92c0-33d6c1b495d8');
      await addToCart(server, body.id, 'c1e435ad-f32b-4b6d-a3d4-bb6897eaa9ce');

      const postAddToCartResponse = await getCartItems(server, body.id);

      expect(postAddToCartResponse.body.length).toBe(2);
      expect(postAddToCartResponse.body[0].title).toBe('The Testaments');
      expect(postAddToCartResponse.body[1].title).toBe('Half a World Away');

      const removeFromCartResponse = await removeFromCart(
        server,
        body.id,
        'a9e9c933-eda2-4f45-92c0-33d6c1b495d8',
      );

      expect(removeFromCartResponse.status).toBe(204);

      const postRemoveFromCartResponse = await getCartItems(server, body.id);

      expect(postRemoveFromCartResponse.body.length).toBe(1);
      expect(postRemoveFromCartResponse.body[0].title).toBe(
        'Half a World Away',
      );
    });

    it('should respond with HTTP 404 when the cart cannot be found', async () => {
      const removeFromCartResponse = await removeFromCart(
        server,
        'unrecognised_basket',
        'a9e9c933-eda2-4f45-92c0-33d6c1b495d8',
      );

      expect(removeFromCartResponse.status).toBe(404);
    });

    it('should respond with HTTP 400 when the item cannot be found', async () => {
      const { body } = await createCart(server);
      const removeFromCartResponse = await removeFromCart(
        server,
        body.id,
        'unrecognised_item',
      );

      expect(removeFromCartResponse.status).toBe(400);
    });
  });
});
