import { Application } from 'express';
import request from 'supertest';
import createServer from '../src/server';
import { Cart } from '../src/data/cart';
import { Record } from '../src/data/dataStore';
import { Item } from '../src/data/item';

const uuidFormat = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/i;

const createCart = async (server: Application) => {
  const response = await request(server)
    .post('/carts')
    .set('Accept', 'application/json');

  // TODO: unify this type assertion with app-wide function
  const body = response.body as Record<Cart>;

  return {
    status: response.status,
    body,
  };
};

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

      const addItemResponse = await request(server)
        .patch(`/carts/${body.id}/items`)
        .send({ id: 'a9e9c933-eda2-4f45-92c0-33d6c1b495d8' })
        .set('Accept', 'application/json');

      expect(addItemResponse.status).toBe(200);

      const getItemsResponse = await request(server)
        .get(`/carts/${body.id}/items`)
        .set('Accept', 'application/json');

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

      const itemsResponse = await request(server)
        .get(`/carts/${body.id}/items`)
        .set('Accept', 'application/json');

      expect(itemsResponse.status).toBe(200);
      expect(itemsResponse.body as Item[]).toEqual([]);
    });

    it('should remove all items when requested with HTTP PUT and an empty array in the body', async () => {
      const { body } = await createCart(server);

      const addItemResponse = await request(server)
        .patch(`/carts/${body.id}/items`)
        .send({ id: 'a9e9c933-eda2-4f45-92c0-33d6c1b495d8' })
        .set('Accept', 'application/json');

      expect(addItemResponse.status).toBe(200);

      const postAddCartResponse = await request(server)
        .get(`/carts/${body.id}/items`)
        .set('Accept', 'application/json');

      expect(postAddCartResponse.status).toBe(200);
      expect((postAddCartResponse.body as Item[])[0].title).toBe('The Testaments');

      const clearItemsResponse = await request(server)
        .put(`/carts/${body.id}/items`)
        .send({ items: [] })
        .set('Accept', 'application/json');

      expect(clearItemsResponse.status).toBe(200);

      const postClearCartResponse = await request(server)
        .get(`/carts/${body.id}/items`)
        .set('Accept', 'application/json');

      expect(postClearCartResponse.status).toBe(200);
      expect((postClearCartResponse.body as Item[]).length).toBe(0);
    });

    it('should respond with HTTP 404 when the cart cannot be found', async () => {
      const itemsResponse = await request(server)
        .get(`/carts/missing_id/items`)
        .set('Accept', 'application/json');

      expect(itemsResponse.status).toBe(404);
    });

    it('should respond with HTTP 400 when the item to add is unrecognised', async () => {
      const { body } = await createCart(server);

      const addItemResponse = await request(server)
        .patch(`/carts/${body.id}/items`)
        .send({ id: 'foo' })
        .set('Accept', 'application/json');

      expect(addItemResponse.status).toBe(400);
    });
  });

  describe('/carts/:id/items/:id', () => {
    it.todo('should remove the item from the cart when requested with HTTP DELETE');
    it.todo('should respond with HTTP 400 when the cart ID is missing');
    it.todo('should respond with HTTP 404 when the cart cannot be found');
    it.todo('should respond with HTTP 400 when the item ID is missing');
    it.todo('should respond with HTTP 404 when the item cannot be found');
  });
});
