const BooleanFaker = {
  schema: {},
  key: '',
  options: {},
  init(schema, key, options) {
    this.schema = schema;
    this.key = key;
    this.options = options;
  },
  getValue(key) {
    return Math.random() < 0.5;
  },
};

module.exports = BooleanFaker;
