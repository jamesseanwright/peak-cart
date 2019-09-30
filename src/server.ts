import express from 'express';
import bodyParser from 'body-parser';
import { cartStore } from './data/cart';
import { createItemStore } from './data/item';
import createCartRouter from './cartRouter';

export type Logger = (...args: any) => void;

const noOp: Logger = () => undefined;

const createServer = (logger = noOp) => {
  const server = express();

  server.use(bodyParser.json());

  server.use('/carts', createCartRouter(logger, cartStore, createItemStore()));

  return server;
};

export default createServer;
