const { describe, it, before, beforeEach, afterEach } = require('mocha');
const { expect }  = require('chai');
const request = require('supertest');
const { join }  = require('path');
const sinon = require('sinon');

const api = require('../../src/api');
const CarService = require('../../src/service/carService');

const carsDatabase = join(__dirname, './../../database', 'cars.json');

const mocks = {
  validCarCategory: require('../mocks/valid-carCategory.json'),
  validCar: require('../mocks/valid-car.json'),
  validCustomer: require('../mocks/valid-customer.json'),
}

describe('API Suite test', () => {

  let carService = {};
  let app = {};
  let sandbox = {};

  before(() => {
    carService = new CarService({
      cars: carsDatabase
    });

    app = api({ carService });
    app.startServer(4000);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  describe('/getAvailableCar', () => {
    it('should request available car for a given category and return HTTP status 200', async () => {
      const car = mocks.validCar;
      const carCategory = {
        ...mocks.validCarCategory,
        cars: [car.id]
      };

      sandbox.stub(
        app.carService.carRepository,
        app.carService.carRepository.find.name,
      ).returns(mocks.validCar);

      const response = await request(app.server)
        .post('/getAvailableCar')
        .send(carCategory)
        .expect(200);

      
      expect(response.body).to.be.deep.equal(car);
    })
  })
  describe('/rent', () => {
    it('should return rent information given a costumer, number of days and car category', async () => {
      const car = mocks.validCar;
      const carCategory = {
        ...mocks.validCarCategory,
        price: 37.6,
        carIds: [car.id],
      };

      const customer = Object.create(mocks.validCustomer);
      customer.age = 20;

      const numberOfDays = 5;

      const now = new Date(2020, 10, 5);
      sandbox.useFakeTimers(now.getTime());
      sandbox.stub(
        app.carService.carRepository,
        app.carService.carRepository.find.name,
      ).resolves(car);

      const requestBody = {
        customer,
        numberOfDays,
        carCategory,
      }

      const response = await request(app.server)
          .post('/rent')
          .send(requestBody)
          .expect(200);

      const expectedAmount = app.carService.currencyFormat.format(206.8);
      const dueDate = "10 de novembro de 2020";
  
      const expected = {
        customer,
        car,
        amount: expectedAmount,
        dueDate,
      }

      console.log(response.body, expected);
        
      expect(JSON.stringify(response.body)).to.be.deep.equal(JSON.stringify(expected));
    })
  })
})