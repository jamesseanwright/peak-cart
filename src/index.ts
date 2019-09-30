import createServer from './server';

const port = 8000;
const server = createServer(console.log);

server.listen(port, () => console.log(`Server listening on port ${port}...`));
