const NumberFaker = {
  schema: {},
  key: '',
  options: {},
  init(schema, key, options) {
    this.schema = schema;
    this.key = key;
    this.options = options;
  },
  getValue(key) {
    return Math.floor(1 + Math.random() * 100) * 1;
  },
};

module.exports = NumberFaker;


/*
*   function genIntegerValue(key) {
    let maxNumber = 100;
    let minNumber = 1;
    let factor = 1;
    if (key.endsWith('Id')) {
      minNumber = 1000;
      maxNumber = 9999;
    }
    if (key.endsWith('Code')) {
      minNumber = 1;
      maxNumber = 9;
    }
    if (key.endsWith('Amount') || key.endsWith('Sum')) {
      minNumber = 100000;
      maxNumber = 100000;
      factor = 1000;
    }

    return Math.floor(minNumber + Math.random() * maxNumber) * factor;
  }
  */
