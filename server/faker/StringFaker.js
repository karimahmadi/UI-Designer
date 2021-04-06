 const faker = require('faker/locale/fa');

function genPersianDate() {
  const year = Math.floor(1300 + Math.random() * 100);
  const month = Math.floor(1 + Math.random() * 12);
  const day = Math.floor(1 + Math.random() * 30);
  return `${year}/${`${month}`.padStart(2, '0')}/${`${day}`.padStart(
    2,
    '0',
  )}`;
}

function genTime() {
  const hour = Math.floor(1 + Math.random() * 12);
  const minute = Math.floor(1 + Math.random() * 60);
  return `${hour}:${minute}`;
}

function genPersianTitle() {
  return faker.lorem.word();
}

function genStringId() {
  const num1 = Math.floor(10 + Math.random() * 100);
  const num2 = Math.floor(100 + Math.random() * 1000);
  const num3 = Math.floor(1000 + Math.random() * 10000);
  return `${num1}${num2}${num3}`;
}

const StringFaker = {
  schema: {},
  key: '',
  options: {},
  init(schema, key, options) {
    this.schema = schema;
    this.key = key;
    this.options = options;
  },
  getValue(key) {
    if (
      key.endsWith('Date') ||
      key.endsWith('DateTime') ||
      key.endsWith('DateTo') ||
      key.endsWith('DateFrom')
    ) {
      return genPersianDate();
    }
    if (key.endsWith('Time')) {
      return genTime();
    }
    if (key.endsWith('Id') || key.endsWith('Number')) {
      return genStringId();
    }

    if (key.endsWith('lastName')) {
      return faker.name.lastName();
    }

    if (key.endsWith('firstName')) {
      return faker.name.firstName();
    }

    if (key.endsWith('address')) {
      return `${faker.address.city()} - ${faker.address.streetName()}`;
    }

    return genPersianTitle();

    // console.log('key:', key);
    // return 'عنوان فارسی';
  },
};

module.exports = StringFaker;




