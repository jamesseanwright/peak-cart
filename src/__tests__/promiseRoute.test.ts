import { Request, Response } from 'express';
import promiseRouteCreator from '../promiseRoute';
import { BadRequestError } from '../cartRouter';

describe('promiseRouteCreator', () => {
  let status: jest.Mock;
  let json: jest.Mock;
  let logger: jest.Mock;
  let promiseHandler: jest.Mock;

  beforeEach(() => {
    status = jest.fn();
    json = jest.fn();
    logger = jest.fn();
    promiseHandler = jest.fn();
  });

  it('should log and invoke a Promise-returning route handler when the inner function is called', async () => {
    const promiseRoute = promiseRouteCreator(logger);
    const handler = promiseRoute(promiseHandler);

    const request = {
      path: '/foo',
    };

    const response = {
      status,
      json,
    };

    promiseHandler.mockResolvedValue(undefined);

    await handler(request as unknown as Request, response as unknown as Response);

    expect(logger).toHaveBeenCalledTimes(1);
    expect(logger).toHaveBeenCalledWith('Request for /foo');
    expect(promiseHandler).toHaveBeenCalledTimes(1);
    expect(promiseHandler).toHaveBeenCalledWith(request, response);
  });

  it('should send an error response when the handler rejects', async () => {
    const error = new Error('Error message');
    const promiseRoute = promiseRouteCreator(logger);
    const handler = promiseRoute(promiseHandler);

    const request = {
      path: '/foo',
    };

    const response = {
      status,
      json,
    };

    promiseHandler.mockRejectedValue(error);
    status.mockReturnValue(response);
    json.mockReturnValue(response);

    await handler(request as unknown as Request, response as unknown as Response);

    expect(status).toHaveBeenCalledTimes(1);
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledTimes(1);

    expect(json).toHaveBeenCalledWith({
      error: error.message,
    });
  });

  it('should send an error response with a custom HTTP status when the error ref has a httpStatus property', async () => {
    const error = new BadRequestError('Error message');
    const promiseRoute = promiseRouteCreator(logger);
    const handler = promiseRoute(promiseHandler);

    const request = {
      path: '/foo',
    };

    const response = {
      status,
      json,
    };

    promiseHandler.mockRejectedValue(error);
    status.mockReturnValue(response);
    json.mockReturnValue(response);

    await handler(request as unknown as Request, response as unknown as Response);

    expect(status).toHaveBeenCalledTimes(1);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledTimes(1);
  });
});
