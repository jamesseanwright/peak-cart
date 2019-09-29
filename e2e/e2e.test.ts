import { Application } from 'express';
import request from 'supertest';
import createServer from '../src/server';
import { Cart } from '../src/data/cart';

const uuidFormat = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/i;

describe('Cart API', () => {
  let server: Application;

  beforeEach(() => {
    server = createServer();
  });

  describe('/carts', () => {
    it('should create a new cart when the endpoint is requested with HTTP POST', async () => {
      const response = await request(server)
        .post('/carts')
        .set('Accept', 'application/json');

      // TODO: unify this type assertion with app-wide function
      const body = response.body as unknown as Cart;

      expect(response.status).toBe(201);
      expect(body.id).toMatch(uuidFormat);
    });
  });

  describe('/carts/:id/items', () => {
    it.todo('should list all of the items in the cart when requested with HTTP GET');
    it.todo('should add an item to the cart when requested with HTTP POST');
    it.todo('should remove all items when requested with HTTP PUT and an empty array in the body');
    it.todo('should respond with HTTP 400 when the cart ID is missing');
    it.todo('should respond with HTTP 404 when the cart cannot be found');
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
