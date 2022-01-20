"use strict";var mocha;module.link('mocha',{default(v){mocha=v}},0);var chai;module.link('chai',{default(v){chai=v}},1);var Person;module.link('./../src/person.js',{default(v){Person=v}},2);
const { describe, it } = mocha;


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
    expect(person).to.be.deep.equal(expected);
   });

  it('should format values', () => {
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
});
