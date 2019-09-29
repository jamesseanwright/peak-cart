import express from 'express';
import bodyParser from 'body-parser';
import { cartStore } from './data/cart';
import { createItemStore } from './data/item';
import createCartRouter from './cartRouter';

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
