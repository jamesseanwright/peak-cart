import { Request, Response } from 'express';
import { Logger } from './server';

type PromiseHandler = (req: Request, res: Response) => Promise<unknown>;

const createErrorBody = (error: string) => ({
  error,
});

/* A function to support Promise-returning route
 * handlers, including logging side-effects. */
const promiseRouteCreator = (logger: Logger) => (handler: PromiseHandler) => (
  req: Request,
  res: Response,
) => {
  logger(`Request for ${req.path}`);

  return handler(req, res).catch(error => {
    const { httpStatus = 500, message } = error;

    logger(`Error: ${message}`);

    res.status(httpStatus).json(createErrorBody(error.message));
  });
};

export default promiseRouteCreator;
