const { error } = require('./src/constants');
const File = require('./src/file');
const { rejects, deepStrictEqual } = require('assert');

(async () => {
  {
    const filePath = './mocks/emptyFile-invalid.csv';
    const rejection = new Error(error.FILE_LENGHT_ERROR_MESSAGE);
    const result = File.csvToJson(filePath)
    await rejects(result, rejection);
  }

  {
    const filePath = './mocks/fourItems-invalid.csv';
    const rejection = new Error(error.FILE_LENGHT_ERROR_MESSAGE);
    const result = File.csvToJson(filePath)
    await rejects(result, rejection);
  }

  {
    const filePath = './mocks/threeItems-valid.csv';
    const result = await File.csvToJson(filePath)
    const expected = [
      {
        "name": "Charles Willian",
        "id": 123,
        "profession": "Javascript Developer",
        "birthDay": 2000
      },
      {
        "name": "Xuxa da silva",
        "id": 321,
        "profession": "Java Developer",
        "birthDay": 1999
      },
      {
        "name": "Joaozin",
        "id": 231,
        "profession": "PHP Developer",
        "birthDay": 1998
      }
    ]

    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
  }
  
  // const result = await File.csvToJson('./mocks/threeItems-valid.csv');
  // const result = await File.csvToJson('./mocks/fourItems-invalid.csv');
  // const result = await File.csvToJson('./mocks/invalid-header.csv');
  // const result = await File.csvToJson('./mocks/emptyFile-invalid.csv');
  // console.log(result);
})()