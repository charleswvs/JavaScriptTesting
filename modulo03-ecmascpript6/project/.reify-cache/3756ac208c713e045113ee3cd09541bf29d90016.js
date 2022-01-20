"use strict";module.export({default:()=>TerminalController});var readlineModule;module.link('readline',{default(v){readlineModule=v}},0);var DraftLog;module.link('draftlog',{default(v){DraftLog=v}},1);var chalk;module.link('chalk',{default(v){chalk=v}},2);var chalkTable;module.link('chalk-table',{default(v){chalkTable=v}},3);var Person;module.link('./person.js',{default(v){Person=v}},4);






class TerminalController {
  constructor({
    readline = readlineModule,
  } = {}) {
    this.print = {};
    this.terminal = {};
    this.data = {};
    this.readline = readline;    
  }

  initializeTerminal(database, language) {
    DraftLog(console).addLineListener(process.stdin);
    this.terminal = this.readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.initializeTable(database, language);
  }

  initializeTable(database, language) {
    const data = database.map(item => new Person(item).formatted(language));
    const table = chalkTable(this.getTableOptions(), data);
    this.print = console.draft(table);
    this.data = data;
  }

  question(msg = '') {
    return new Promise((resolve) => this.terminal.question(msg, resolve));
  }

  updateTable(item){
    this.data.push(item);
    this.print(chalkTable(this.getTableOptions(), this.data));
  }

  closeTerminal() {
    this.terminal.close();
  }

  getTableOptions() {
    return {
      leftPad: 2,
      columns: [
        { field: "id", name: chalk.cyan('ID')},
        { field: "vehicles", name: chalk.magenta('Vehicles')},
        { field: "kmTraveled", name: chalk.green('Km Traveled')},
        { field: "from", name: chalk.redBright('From')},
        { field: "to", name: chalk.yellow('To')},
      ]
    }
  }
}

//2 Bike 1231412 2000-01-01 2001-01-01