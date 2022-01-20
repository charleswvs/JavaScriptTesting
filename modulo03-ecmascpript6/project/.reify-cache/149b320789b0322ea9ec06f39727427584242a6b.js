"use strict";var expect;module.link('chai',{expect(v){expect=v}},0);var sinon;module.link('sinon',{default(v){sinon=v}},1);var Person;module.link('../src/person.js',{default(v){Person=v}},2);var TerminalController;module.link('../src/terminalController.js',{default(v){TerminalController=v}},3);var validDatabaseItem;module.link('./mocks/valid-databaseItem.js',{default(v){validDatabaseItem=v}},4);var readline;module.link('readline',{default(v){readline=v}},5);var mocha;module.link('mocha',{default(v){mocha=v}},6);






const { describe, it, done } = mocha;

const mocks = {
  database: [validDatabaseItem]
}

const LANGUAGE = 'pt-BR';

describe('Terminal Controller', () => {
  let sandbox = {};
  let terminalController = {};

  before(() => {
    terminalController = new TerminalController();
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should initialize terminal', () => {
    sandbox.stub(
      terminalController,
      terminalController.initializeTable.name
    );

    sandbox.spy(
      terminalController.readline,
      terminalController.readline.createInterface.name
    );

    terminalController.initializeTerminal(mocks.database, LANGUAGE);

    expect(terminalController.initializeTable.calledOnce).to.be.ok;
    expect(terminalController.initializeTable.calledWith(mocks.database, LANGUAGE)).to.be.ok;
    expect(terminalController.readline.createInterface.calledWith({
      input: process.stdin,
      output: process.stdout
    })).to.be.ok;
    expect(terminalController.terminal).to.be.an.instanceOf(readline.Interface);
    expect(terminalController.terminal).to.not.equal({});
  });

  it('should initialize table', () => {
    terminalController.initializeTable(mocks.database, LANGUAGE);
    const expected = [new Person(validDatabaseItem).formatted(LANGUAGE)];

    expect(terminalController.data).to.be.deep.equal(expected);
    expect(terminalController.print).to.be.an.instanceOf(Function);
    expect(terminalController.print).to.not.equal({});
  });

  it('should return correct table options', () => {
    const received = terminalController.getTableOptions();
    const expected = {
      leftPad: 2,
      columns: [
        { field: 'id', name: '\x1B[36mID\x1B[39m' },
        { field: 'vehicles', name: '\x1B[35mVehicles\x1B[39m' },
        { field: 'kmTraveled', name: '\x1B[32mKm Traveled\x1B[39m' },
        { field: 'from', name: '\x1B[91mFrom\x1B[39m' },
        { field: 'to', name: '\x1B[33mTo\x1B[39m' }
      ]
    }

    expect(received).to.deep.equal(expected);
  });

  it('should call close terminal controller', () => {
    terminalController.terminal = {
      close: () => {},
    };

    sandbox.spy(
      terminalController.terminal,
      terminalController.terminal.close.name
    );

    terminalController.closeTerminal();

    expect(terminalController.terminal.close.calledOnce).to.be.ok;
  });

  it('should update table', () => {
    terminalController.data = [];
    const person = new Person(validDatabaseItem).formatted(LANGUAGE);
    terminalController.updateTable(person);
    
    expect(terminalController.data).to.be.deep.equal([person]);
  })

  it('should call terminal question', () => {
    terminalController.terminal = {
      question: () => {},
    };

    sandbox.spy(
      terminalController.terminal,
      terminalController.terminal.question.name
    );
    
    const message = 'hello world';
    terminalController.question(message).then(msg => {
      console.log('ola')
      expect(terminalController.terminal.question.calledOnce).to.be.ok;
      expect(terminalController.terminal.question.calledWith(message)).to.be.ok;
      done();
    })
  })
})