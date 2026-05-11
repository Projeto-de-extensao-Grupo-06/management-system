const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '..', 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Mount the json-server router under /api
server.use('/api', router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server running on port ${port}`);
});
