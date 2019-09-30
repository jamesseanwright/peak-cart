# Technical Approach

## Tech stack

I chose Node.js as the runtime of my project, which I complemented with Express for HTTP routing, because these are the server-side technologies with which I am the most familiar, but Express' API also provides a succinct means of declaring the endpoints my application exposes. On top of this stack, I opted to use TypeScript in lieu of vanilla JavaScript to statically analyse my code ahead of runtime, reducing the debugging to which I had to commit and facilitating the scaling of my codebase as implemented additional endpoints.

## Architecture

As opposed to explicit endpoints per action (e.g. `/cart/:cartId/add`, `/cart/:cartId/remove` etc.), I went with a [RESTful approach](https://en.wikipedia.org/wiki/Representational_state_transfer) to reduce friction when adding new behaviours to existing endpoints e.g. retrieving a single item by adding HTTP GET support to `/cart/:cartId/items/:itemId`; keeping these endpoints consistent facilitates their discoverability, although I'd still advocate for their documentation!

When dealing with asynchronous code in my route handlers, I used `Promise` methods (i.e. `then` and `catch`) in favour of the `async`/`await` keywords, as I found this to be less verbose, especially in respect to error handling. Commit [e17e31b](https://github.com/jamesseanwright/peak-cart/commit/e17e31b9fc865ee282224e4768ceb27058994300) demonstrates my migration from `async`/`await`. I nonetheless continued to use `async/await` in the end-to-end tests, as it enabled me to reference responses from previous operations in subsquent ones.

## Persistence

As per the specification, I wrote [an abstraction over JavaScript's `Map` constructor to store records in memory](https://github.com/jamesseanwright/peak-cart/blob/master/src/data/dataStore.ts) and retrieve them by their ID; this resulted in two key interfaces:

* `Entity`: the core atom of my persistence layer, which is simply an object with an ID. This means that models can simply refer to relational data by ID, rather than storing duplicate, redundant data

* `Record<TModel>`: an entry in a particular data store, analogous to a row in a database table

Despite the synchronous nature of `Map` and its methods, the methods of my data store return `Promise`s. This is so one can replace this store with a truly asynchronous data connector (e.g. a database) without having to change all of the existing call sites.

One key downside of using a `Map` for persisting data is that the keys are strongly-held, which could result in a memory leak if many baskets are created. A reasonable workaround could be to use some sort of [LRU mechanism](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)), although this could cause potential side-effects for users downstream.

Rather than use auto-incrementing numbers, the computed IDs for new entities are [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier)s; this is to prevent the [information disclosure vulnerability associated with serial IDs](https://www.clever-cloud.com/blog/engineering/2015/05/20/why-auto-increment-is-a-terrible-idea/).

## Testing

The commit history will evidence that I made use of test-driven development, especially from an end-to-end perspective; by writing the tests ahead of the implementation, I only ever wrote the minimum code required to solve the challenge, and could subsequently refactor with confidence. For these tests, I used [Jest](https://jestjs.io/) and [SuperTest](https://github.com/visionmedia/supertest). I have also written some unit tests that also use Jest.

## Next steps

To ready this service for production, one could use a relational database, such as [PostgreSQL](https://en.wikipedia.org/wiki/PostgreSQL), to persist the data beyond runtime, and deploy it alongside the application in a container. However, this would prohibit the database from being scaled independently of the app, thus I'd recommend deploying to a cloud database service e.g. [Amazon RDS](https://aws.amazon.com/rds/postgresql/).

I would also like to add formal schema validation to my endpoints to more deeply ensure that my endpoints handle valid payloads and reject those that are invalid; [Joi](https://github.com/hapijs/joi) would solve this well.

To truly separate the cart and product domains, I would recommend the development of a separate product/item service, which would be queried by the cart service. These respective services would each have their own databases, rendering a document store/NoSQL a good fit. These services could even be deployed as lambdas if they held no state beyond the databases to which they connect.
