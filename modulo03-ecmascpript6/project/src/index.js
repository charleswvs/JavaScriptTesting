import database from './../database.json';
import Person from './person.js';
import * as repository from './repository.js';
import TerminalController from './terminalController.js';

const injector = () => {
  const terminalController = new TerminalController({
    database,
  });
  return {
    terminalController,
    repository,
  }
}

class Main {
  DEFAULT_LANG = 'pt-BR';
  STOP_TERM = ":q";
  
  constructor({
    terminalController,
    repository,
  } = injector()){
    this.terminalController = terminalController;
    this.repository = repository;

    this.terminalController.initializeTerminal(this.DEFAULT_LANG);
  }

  async runLoop() {
    try {
      const answer = await this.terminalController.question('Insert a person: ');
      if(answer === this.STOP_TERM) {
        this.terminalController.closeTerminal();
        console.log('Bye!');
        return;
      }
      const person = Person.generateInstanceFromString(answer);
      this.terminalController.updateTable(person.formatted(this.DEFAULT_LANG));
      await this.repository.save(person);

      return this.runLoop()
    } catch (error) {
      console.error('An error occurred', error);
      return;
    }
  }
}

if(process.env.NODE_ENV !== 'test') {
  await new Main().runLoop();
}

export default (dependencies) => new Main(dependencies);