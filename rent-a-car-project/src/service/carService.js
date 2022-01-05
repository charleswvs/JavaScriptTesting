const BaseRepository = require('./../repository/base/baseRepository');

class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars });
  }

  test(id) {
    return this.carRepository.find(id);
  }

  async getAvailableCars(carCategory) {
    const carId = this.chooseRandomCar(carCategory);
    const car = await this.carRepository.find(carId);

    return car;
  }

  getRandomPositionFromArray(list) {
    const listLength = list.length;
    return Math.floor(
      Math.random() * listLength
    )
  }

  chooseRandomCar(carCategory) {
    const randomCarIndex = this.getRandomPositionFromArray(carCategory.carIds);
    const carId = carCategory.carIds[randomCarIndex];

    return carId;
  }
}

module.exports = CarService;