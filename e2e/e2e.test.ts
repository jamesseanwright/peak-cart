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
    it.todo('should add an item to the cart when requested with HTTP POST');

    it('should list all of the items in the cart when requested with HTTP GET', async () => {
      // TODO: assert against items once above test is complete
      const { body } = await createCart(server);

      const itemsResponse = await request(server)
        .get(`/carts/${body.id}/items`)
        .set('Accept', 'application/json');

      expect(itemsResponse.status).toBe(200);
      expect(itemsResponse.body as Item[]).toEqual([]);
    });

    it.todo('should remove all items when requested with HTTP PUT and an empty array in the body');

    it('should respond with HTTP 404 when the cart cannot be found', async () => {
      const itemsResponse = await request(server)
        .get(`/carts/missing_id/items`)
        .set('Accept', 'application/json');

      expect(itemsResponse.status).toBe(404);
    });

    it.todo('should respond with HTTP 400 when the item to add is invalid');
    it.todo('should respond with HTTP 422 when the item to add is not recognised');
  });

  describe('/carts/:id/items/:id', () => {
    it.todo('should remove the item from the cart when requested with HTTP DELETE');
    it.todo('should respond with HTTP 400 when the cart ID is missing');
    it.todo('should respond with HTTP 404 when the cart cannot be found');
    it.todo('should respond with HTTP 400 when the item ID is missing');
    it.todo('should respond with HTTP 404 when the item cannot be found');
  });
});
