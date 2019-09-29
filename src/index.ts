import createServer from './server';

const port = 8000;
const server = createServer();

server.listen(() => console.log(`Server listening on port ${port}...`));
