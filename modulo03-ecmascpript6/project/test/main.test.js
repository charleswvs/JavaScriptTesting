import { expect } from 'chai';
import sinon from 'sinon';
import TerminalController from '../src/terminalController.js';
import validDatabaseItem  from './mocks/valid-databaseItem.js';
import mocha from 'mocha';
import Main from '../src/index.js';
import Person from '../src/person.js';
const { describe, it } = mocha;

describe('Main', () => {
  let sandbox = sinon.createSandbox();
  let terminalController = {
    initializeTerminal: () => {},
    closeTerminal: () => {},
    updateTable: () => {},
    question: () => Promise.resolve(''),
  };
  let repository = {
    save: () => Promise.resolve(),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should initialize application', () => {
    sandbox.stub(terminalController, terminalController.initializeTerminal.name);

    Main({
      terminalController,
      repository
    });

    expect(terminalController.initializeTerminal.calledOnce).to.be.ok;
  });
  
  it('should runLoop correclty', async () => {
    const main = Main({
      terminalController,
      repository
    });

    const insertedString = '2 Bike 1231412 2000-01-01 2001-01-01';

    sandbox
      .stub(terminalController, terminalController.question.name)
      .onFirstCall()
      .returns(insertedString)
      .onSecondCall()
      .returns(':q')
    sandbox
      .stub(terminalController, terminalController.updateTable.name);
    sandbox
      .stub(repository, repository.save.name);
    sandbox
      .stub(terminalController, terminalController.closeTerminal.name);

    const expectedPerson = Person.generateInstanceFromString(insertedString);
    
    await main.runLoop();

    expect(terminalController.question.callCount).to.be.equal(2);
    expect(terminalController.updateTable.calledOnce).to.be.ok;
    expect(terminalController.updateTable.calledWith(expectedPerson.formatted('pt-BR'))).to.be.ok;
    expect(repository.save.calledOnce).to.be.ok;
    expect(repository.save.calledWith(expectedPerson)).to.be.ok;  
    expect(terminalController.closeTerminal.calledOnce).to.be.ok;
  });
})