# Peak Cart

A microservice that power the shopping cart of an online book store (read: my tech test for Peak), developed with [Node.js](https://nodejs.org/en/), [Express](https://expressjs.com/) and [TypeScript](https://www.typescriptlang.org/).

## Endpoints

**Note**: all of these endpoints accept and return JSON, thus you'll need to set the `Accept` header of your requests to `application/json`.

### `POST /carts`

Creates a new cart, returning an ID:

```js
// POST http://localhost:8000/carts

{
  "id": "14ffb40c-8c47-41d5-993e-f050630ccb9c"
}
```

#### HTTP status codes

* 200 - cart was successfully created

### `GET /carts/:cartId/items`

Retrieves the items stored in the requested cart:

```js
// GET http://localhost:8000/carts/14ffb40c-8c47-41d5-993e-f050630ccb9c/items

[
  {
    "id": "a9e9c933-eda2-4f45-92c0-33d6c1b495d8",
    "title": "The Testaments",
    "price": {
      "currencyCode": "GBP",
      "amount": "10.00"
    }
  }
]
```

#### HTTP status codes

* 200 - items were successfully retrieved
* 404 - cart with the requested ID could not be found

### `PATCH /carts/:cartId/items`

Adds the item ID to the requested cart:

```js
/* PATCH http://localhost:8000/carts/14ffb40c-8c47-41d5-993e-f050630ccb9c/items
 *
 * Request body:
 * {
 *   "itemId": "a9e9c933-eda2-4f45-92c0-33d6c1b495d8"
 * }
 */
```

**Note**: this endpoint will return no content, opting for a HTTP 204 (No Content) status code instead.

#### HTTP status codes

* 204 - item was successfully added to the cart
* 400 - item ID to add to the cart could not be recognised
* 404 - cart with the requested ID could not be found

### `PUT /carts/:cartId/items`

Replaces all the of the items in the requested cart. This currently only accepts an empty array of items i.e. to empty the cart:

```js
/* PUT http://localhost:8000/carts/14ffb40c-8c47-41d5-993e-f050630ccb9c/items
 *
 * Request body:
 * {
 *   "itemIds": []
 * }
 */
```

**Note**: this endpoint will return no content, opting for a HTTP 204 (No Content) status code instead.

#### HTTP status codes

* 204 - items were successfully cleared from the cart
* 400 - array of items in the request body was not empty
* 404 - cart with the requested ID could not be found

### `DELETE /carts/:id/items/:itemId`

Removes an item from the requested cart:

```js
// DELETE http://localhost:8000/carts/14ffb40c-8c47-41d5-993e-f050630ccb9c/items/a9e9c933-eda2-4f45-92c0-33d6c1b495d8
```

**Note**: this endpoint will return no content, opting for a HTTP 204 (No Content) status code instead.

#### HTTP status codes

* 204 - item was successfully removed from the cart
* 400 - item ID to add to the cart could not be recognised
* 404 - cart with the requested ID could not be found

## Running locally

To set up the project locally, run the following in your terminal (note that these commands are for shell/`sh`):

```sh
$ git clone https://github.com/jamesseanwright/peak-cart.git
$ cd peak-cart
$ nvm i # Installs the required version of Node.js found in .nvmrc. See https://github.com/nvm-sh/nvm
$ npm i
```

One can then run these commands:

* `npm run build`: compiles the TypeScript source files to plain JavaScript
* `npm start`: runs the compiled server
* `npm run format`: uses [Prettier](https://prettier.io/) to format the source files, overwriting them in-place
* `npm run test:unit`: runs the unit tests (append `-- --watch` to run in Jest's watch mode)
* `npm run test:e2e`: runs the end-to-end tests (append `-- --watch` to run in Jest's watch mode)
* `npm test`: runs both the unit and end-to-end suites

## Technical approach

I have written a [standalone document covering my approach](/jamesseanwright/peak-cart/blob/master/APPROACH.md) and its justification.
