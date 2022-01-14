const http = require('http');
const { join }  = require('path');

const CarService = require('./service/carService');

const carsdb = join(__dirname, './../../database', 'cars.json');

const injector = () => {
  const carService = new CarService({ cars: carsdb });
  return { carService };
}

class Api {
  _routes = {
    '/getAvailableCar:post': async (request, response) => {

      for await (const data of request)  {
        const carCategory = JSON.parse(data);
        
        if(carCategory){
          const availableCar = await this.carService.getAvailableCars(carCategory);
          response.write(JSON.stringify(availableCar));
          return response.end();
        }
      }
      response.writeHead(400, { 'Content-Type': 'text/html' })
      response.write('Invalid or missing category');
      return response.end();
    },
    '/rent:post': async (request, response) => {
      for await (const data of request)  {
        const body = JSON.parse(data || '{}');
        
        const { customer, carCategory, numberOfDays} = body

        if(customer && carCategory && numberOfDays){
          const receipt = await this.carService.rent(customer, carCategory, numberOfDays);
          response.write(JSON.stringify(receipt));
          return response.end();
        }
      }
      response.writeHead(400, { 'Content-Type': 'text/html' })
      response.write('Invalid or missing category');
      return response.end();
    },
    default: (request, response) => {
      response.writeHead(404, { 'Content-Type': 'text/html' });
      response.write('Not Found');
      return response.end();
    }
  };

  server = {};

  constructor (dependencies = injector()) {
    this.carService = dependencies.carService;
  }

  startServer = (port) => {
    this.server = http.createServer(this._handler)
    .listen(port || 3000, () => console.log('Server listening on port', port || 3000));

    return this.server;
  }

  _handler = (request, response) => {
    const { method, url } = request;
    const routeKey = `${url}:${method.toLowerCase()}`;
    console.log('routeKey', routeKey);
    const chosen = this._routes[routeKey] || this._routes.default;
    response.writeHead(200, { 'Content-Type': 'application/json' });
    return chosen(request, response);
  }
}

if(process.env.NODE_ENV !== 'test'){
  const api = new Api()
  api.startServer()
}

module.exports = ({ dependencies }) => new Api(dependencies);