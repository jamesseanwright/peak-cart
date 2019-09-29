import express from 'express';

export interface Cart {
  id: string;
}

const createServer = () => express();

export default createServer;
