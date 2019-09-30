# Peak Cart

A microservice that power the shopping cart of an online book store (read: my tech test for Peak), developed with [Node.js](https://nodejs.org/en/), [Express](https://expressjs.com/) and [TypeScript](https://www.typescriptlang.org/).

## Endpoints



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