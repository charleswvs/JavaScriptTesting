const http = require('http');
const DEFAULT_USER = { username: 'johndoe', password: '123456' };
const routes =  {
  '/contact:get': (request, response) => {
    response.write('contact us page');
    response.end();
  },
  '/login:post': async (request, response) => {
    // response é um iterator
    for await (const data of request)  {
      const user = JSON.parse(data);
      if(user.username !== DEFAULT_USER.username || user.password !== DEFAULT_USER.password) {
        response.writeHead(401);
        response.write('Logging has failed!');
        return response.end();
      }
      response.write('Logging has succeeded!');
      return response.end();
    }
  },
  default: (request, response) => {
    response.write('Hello World!');
    return response.end();
  }
}

const handler = function (request, response) {
  const { method, url } = request;
  const routeKey = `${url}:${method.toLowerCase()}`;
  console.log('routeKey', routeKey);
  const chosen = routes[routeKey] || routes.default;
  response.writeHead(200, { 'Content-Type': 'text/html' });
  return chosen(request, response);
}

const app = http.createServer(handler)
  .listen(3000, () => console.log('Server listening on port', 3000));

module.exports = app;