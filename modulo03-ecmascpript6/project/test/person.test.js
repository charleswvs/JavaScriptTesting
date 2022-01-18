import mocha from 'mocha';
const { describe, it } = mocha;
import chai from 'chai';
import Person from './../src/person.js';
const { expect } = chai;

describe('Person', () => {
  it('should return a person instance from a string', () => {
    const person = Person.generateInstanceFromString(
      '1 Bike,Moto 2000 2020-01-01 2020-01-02'
    );

    const expected = {
      from: '2020-01-01',
      to: '2020-01-02',
      vehicles: ['Bike', 'Moto'],
      kmTraveled: '2000',
      id: '1'
    };

    console.log(person)

    expect(person).to.be.deep.equal(expected);
   });

  it('shoud format values', () => {
    const person = new Person({
      id: '1',
      vehicles: [ 'Bike', 'Moto' ],
      kmTraveled: '2000',
      from: '2020-01-01',
      to: '2020-01-02'
    })
    const result = person.formatted('pt-BR');
    expect(result).to.be.deep.equal({
      id: 1,
      vehicles: 'Bike e Moto',
      kmTraveled: '2.000 km',
      from: '01 de janeiro de 2020',
      to: '02 de janeiro de 2020'
    });
   })
})