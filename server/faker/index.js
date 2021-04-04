// const path = require('path');
const fs = require('fs');
const swaggerParser = require('swagger-parser');
// const faker = require('faker/locale/fa');
const stringFaker = require('./StringFaker');
const numberFaker = require('./NumberFaker');
const booleanFaker = require('./BooleanFaker');

function TataFaker() {
  const logResult = {};

  function genProperties(properties) {
    const result = {};
    for (const [key, value] of Object.entries(properties)) {
      if (value.type === 'integer') result[key] = numberFaker.getValue(key);
      else if (value.type === 'string') result[key] = stringFaker.getValue(key);
      else if (value.type === 'object') {
        if (value.properties) result[key] = genProperties(value.properties);
        else console.log('properties:', properties);
      }
    }
    return result;
  }

  function genObjectArray(schema) {
    const result = [];
    const count = Math.floor(1 + Math.random() * 10);
    for (let i = 0; i < count; i += 1) {
      result.push(genProperties(schema.items.properties));
    }
    return result;
  }

  function genIntegerArray() {
    const result = [];
    const count = Math.floor(1 + Math.random() * 10);
    for (let i = 0; i < count; i += 1) {
      result.push(Math.floor(1 + Math.random() * 10));
    }
    return result;
  }

  function message(schema) {
    return null;
  }

  function response(schema, key) {
    let result = {};
    if (schema.type === 'object') {
      result = {};
      if (schema.properties) {
        for (const [key, value] of Object.entries(schema.properties)) {
          result[key] = response(value, key);
        }
      }
    } else if (schema.type === 'array') {
      result = [];
      if (schema.items.type === 'object') {
        result = genObjectArray(schema);
      } else if (schema.items.type === 'integer') {
        result = genIntegerArray();
      } else {
        throw new Error('items of this type not implemented yet');
      }
    } else if (schema.type === 'integer' || schema.type === 'number')
      return numberFaker.getValue(key);
    else if (schema.type === 'string') return stringFaker.getValue(key);
    else if (schema.type === 'boolean') return booleanFaker.getValue(key);

    return result;
  }

  function extractResponse(schema) {
    let result = {};
    if (schema.type === 'object') {
      for (const [key, value] of Object.entries(schema.properties)) {
        if (key === 'message') {
          result[key] = message(value, key);
        } else {
          result[key] = response(value, key);
        }
      }
    } else if (schema.type === 'array') {
      result = [];
      if (schema.items.type === 'object') {
        result = genObjectArray(schema);
      } else if (schema.items.type === 'integer') {
        result = genIntegerArray();
      } else {
        throw new Error('items of this type not implemented yet');
      }
    }
    return result;
  }

  function initializeEndpoints(api, app) {
    for (const p in api.paths) {
      const methods = api.paths[p];
      initializeMethods(methods, p, app); // api.basePath + path
    }
  }

  function initializeMethods(methods, path, app) {
    for (const method in methods) {
      const { responses, parameters, deprecated } = methods[method];
      let formattedPath = path.replace('{', ':').replace('}', '');
      formattedPath = formattedPath.replace('{', ':').replace('}', '');

      /* check API specs */
      // const { schema } = responses[200];
      // if (!schema || !schema.properties || !schema.properties.response) {
      //   console.log(path);
      // }

      app[method](formattedPath, (req, res) => {
        // check not deprecated

        // check validation of services
        // check parameters required
        // check parameters type
        // in body, query, path

        // generate response
        const { schema } = responses[200];
        if (!schema) console.log('responses:', responses);
        res.json(extractResponse(schema));
      });
    }
  }

  function saveCurrentFileBackup(fileName, api, url) {
    fs.writeFile(fileName, api, err => {
      if (!err) {
        logResult[url].push(`Backup file saved`);
      } else {
        logResult[url].push(`Error when save backup file`);
      }
    });
  }

  function init(app) {
    const options = {
      dereference: {
        circular: false, // Don't allow circular $refs
      },
    };

    const fileUrlMapper = {
      'http://192.168.101.171:8000/v2/api-docs': 'lc.old.json',
      'http://192.168.101.171/swagger/lo/general/v2/api-docs':
        'lo.general.json',
      'http://192.168.101.171/swagger/sepam/v2/api-docs': 'sepam.json',
      'http://192.168.101.171/swagger/accounting/v2/api-docs':
        'accounting.json',
      'http://192.168.101.171/swagger/gateway/v2/api-docs': 'gateway.json',
      'http://192.168.101.171/swagger/general/v2/api-docs': 'general.json',
      'http://192.168.101.171/swagger/lc/core/v2/api-docs': 'lc.core.json',
      'http://192.168.101.171/swagger/lc/report/v2/api-docs': 'lc.report.json',
      'http://192.168.101.171/swagger/gl/v2/api-docs': 'gl.json',
      'http://192.168.20.72:5020/swagger/lo/loan/interestfree/v2/api-docs':
        'interest.free.loan.json',
    };

    Object.keys(fileUrlMapper).forEach(url => {
      logResult[url] = ['Try loading api from url'];
      /* save backup to use later when it is down */
      swaggerParser.bundle(url).then(
        api => {
          const fileName = fileUrlMapper[url];
          saveCurrentFileBackup(fileName, JSON.stringify(api, null, 4), url);
          swaggerParser.dereference(api, options).then(
            data => {
              initializeEndpoints(data, app);
              logResult[url].push(`SUCCESS to dereference from url`);
            },
            () => {
              logResult[url].push(`FAILED to dereference from api json`);
            },
          );
        },
        () => {
          logResult[url].push('FAILED to load from url');
          /* load from last backup if exist */

          const fileName = fileUrlMapper[url];
          if (fs.existsSync(fileName)) {
            logResult[url].push(
              `Try to load from last backup file: ${fileName}`,
            );
            swaggerParser.dereference(fileName, options).then(
              api => {
                initializeEndpoints(api, app);
                logResult[url].push(`SUCCESS load from backup : ${fileName}`);
              },
              () => {
                logResult[url].push(
                  `Failed to load from backup file : ${fileName}`,
                );
              },
            );
          } else {
            logResult[url].push(`Backup file NOT exists: ${fileName}`);
          }
        },
      );
    });

    // const rules = {
    //   '/rest/lo/general/assurancetype/{code}': {
    //     get: {
    //       example: {
    //         message: null,
    //         response: {
    //           assuranceTypeCode: 1,
    //           title: 'کد نوع ضمانت',
    //         },
    //       },
    //     },
    //   },
    // };

    app.get('/rest/security/user/info', (req, res) => {
      res.send({
        response: {
          user: {
            id: 107640,
            userName: '205429',
            firstName: 'کریم',
            lastName: 'زند',
            organ: {
              id: 208,
              children: [],
              code: 409,
              title: ' شعبه چیتگر',
              parentOrgan: { id: 2406, children: [] },
              organType: { code: 3, title: 'شعبه' },
              organStatus: { code: 1, title: 'فعال' },
              serverMac: '00:04:75:0a:6e:a6',
              clrCode: 409,
            },
            organId: 208,
            personalCode: 205429,
            fullName: 'کریم زند',
          },
          userOrgan: {
            id: 208,
            code: 409,
            title: ' شعبه چیتگر',
            organType: { code: 3, title: 'شعبه' },
            parentOrgan: {
              id: 2406,
              code: null,
              title: null,
              organType: null,
              parentOrgan: null,
            },
          },
          menus: [
            {
              id: 1360,
              title: 'عملیات اصلی',
              type: { code: 1, title: 'منو' },
              ordering: 3,
              link: '/',
              status: { code: 1, title: 'فعال' },
              application: { code: 83, hasAccess: true },
              children: [
                {
                  id: 1382,
                  name: '83001',
                  title: 'عملیات سپام',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 2,
                  link: '/request-inquiry/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/request-inquiry/search',
                  nameWithoutPrefix: '',
                },
                {
                  id: 1361,
                  name: '83002',
                  title: 'انعقاد قرارداد',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 3,
                  link: '/contract-lc/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/contract-lc/search',
                  nameWithoutPrefix: '',
                },
                {
                  id: 1362,
                  title: 'ثبت وثایق',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 4,
                  link: '/collaterals/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/collaterals/search',
                },
                {
                  id: 1364,
                  title: 'دریافت از مشتری',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 5,
                  link: '/customer-receipt/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/customer-receipt/search',
                },
                {
                  id: 1365,
                  title: 'تمدید مدت قرارداد',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 6,
                  link: '/contract-respite/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/contract-respite/search',
                },
                {
                  id: 1366,
                  title: 'تغییرات قرارداد',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 7,
                  link: '/contract-changes/contract-change',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/contract-changes/contract-change',
                },
                {
                  id: 1368,
                  title: 'ارائه سند حمل',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 8,
                  link: '/transport-document/offer',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/transport-document/offer',
                },
                {
                  id: 1370,
                  title: 'پرداخت وجه به ذینفع',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 9,
                  link: '/payment-to-beneficiary/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/payment-to-beneficiary/search',
                },
                {
                  id: 1369,
                  title: 'ظهرنویسی و تحویل اسناد',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 10,
                  link: '/def-payment-endorse/endorse',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/def-payment-endorse/endorse',
                },
                {
                  id: 1371,
                  title: 'وصول',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 11,
                  link: '/credit-after-due-payoff/create',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/credit-after-due-payoff/create',
                },
                {
                  id: 1367,
                  title: 'تسویه قرارداد',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 12,
                  link: '/contract-payoff/payoff',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/contract-payoff/payoff',
                },
              ],
              url: '/',
              childs: [
                {
                  id: 1382,
                  name: '83001',
                  title: 'عملیات سپام',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 2,
                  link: '/request-inquiry/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/request-inquiry/search',
                  nameWithoutPrefix: '',
                },
                {
                  id: 1361,
                  name: '83002',
                  title: 'انعقاد قرارداد',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 3,
                  link: '/contract-lc/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/contract-lc/search',
                  nameWithoutPrefix: '',
                },
                {
                  id: 1362,
                  title: 'ثبت وثایق',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 4,
                  link: '/collaterals/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/collaterals/search',
                },
                {
                  id: 1364,
                  title: 'دریافت از مشتری',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 5,
                  link: '/customer-receipt/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/customer-receipt/search',
                },
                {
                  id: 1365,
                  title: 'تمدید مدت قرارداد',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 6,
                  link: '/contract-respite/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/contract-respite/search',
                },
                {
                  id: 1366,
                  title: 'تغییرات قرارداد',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 7,
                  link: '/contract-changes/contract-change',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/contract-changes/contract-change',
                },
                {
                  id: 1368,
                  title: 'ارائه سند حمل',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 8,
                  link: '/transport-document/offer',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/transport-document/offer',
                },
                {
                  id: 1370,
                  title: 'پرداخت وجه به ذینفع',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 9,
                  link: '/payment-to-beneficiary/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/payment-to-beneficiary/search',
                },
                {
                  id: 1369,
                  title: 'ظهرنویسی و تحویل اسناد',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 10,
                  link: '/def-payment-endorse/endorse',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/def-payment-endorse/endorse',
                },
                {
                  id: 1371,
                  title: 'وصول',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 11,
                  link: '/credit-after-due-payoff/create',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/credit-after-due-payoff/create',
                },
                {
                  id: 1367,
                  title: 'تسویه قرارداد',
                  parent: { id: 1360 },
                  type: { code: 1, title: 'منو' },
                  ordering: 12,
                  link: '/contract-payoff/payoff',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/contract-payoff/payoff',
                },
              ],
            },
            {
              id: 1372,
              title: 'گزارشات',
              type: { code: 1, title: 'منو' },
              ordering: 4,
              link: '/',
              status: { code: 1, title: 'فعال' },
              application: { code: 83, hasAccess: true },
              children: [
                {
                  id: 1373,
                  title: 'گزارشات جریان اصلی',
                  parent: { id: 1372 },
                  type: { code: 1, title: 'منو' },
                  ordering: 2,
                  link: '/main-stream-report',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/main-stream-report',
                },
                {
                  id: 1374,
                  title: 'گزارشات پیامهای 700 بانک تجارت',
                  parent: { id: 1372 },
                  type: { code: 1, title: 'منو' },
                  ordering: 3,
                  link: '/message-700-report',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/message-700-report',
                },
                {
                  id: 1380,
                  title: 'گزارش اسناد مالی',
                  parent: { id: 1372 },
                  type: { code: 1, title: 'منو' },
                  ordering: 4,
                  link: '/financial-document-report',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/financial-document-report',
                },
                {
                  id: 1881,
                  title: 'گزارش عملیات باز شعب',
                  parent: { id: 1372 },
                  type: { code: 1, title: 'منو' },
                  ordering: 5,
                  link: '/openingDateReport',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/openingDateReport',
                },
                {
                  id: 1660,
                  title: 'کارت معین',
                  parent: { id: 1372 },
                  type: { code: 1, title: 'منو' },
                  ordering: 6,
                  link: '/certain-bank-card/view',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/certain-bank-card/view',
                },
                {
                  id: 2141,
                  title: 'سایر گزارشات',
                  parent: { id: 1372 },
                  type: { code: 1, title: 'منو' },
                  ordering: 7,
                  link: 'http://192.168.101.171',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: 'http://192.168.101.171',
                },
              ],
              url: '/',
              childs: [
                {
                  id: 1373,
                  title: 'گزارشات جریان اصلی',
                  parent: { id: 1372 },
                  type: { code: 1, title: 'منو' },
                  ordering: 2,
                  link: '/main-stream-report',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/main-stream-report',
                },
                {
                  id: 1374,
                  title: 'گزارشات پیامهای 700 بانک تجارت',
                  parent: { id: 1372 },
                  type: { code: 1, title: 'منو' },
                  ordering: 3,
                  link: '/message-700-report',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/message-700-report',
                },
                {
                  id: 1380,
                  title: 'گزارش اسناد مالی',
                  parent: { id: 1372 },
                  type: { code: 1, title: 'منو' },
                  ordering: 4,
                  link: '/financial-document-report',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/financial-document-report',
                },
                {
                  id: 1881,
                  title: 'گزارش عملیات باز شعب',
                  parent: { id: 1372 },
                  type: { code: 1, title: 'منو' },
                  ordering: 5,
                  link: '/openingDateReport',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/openingDateReport',
                },
                {
                  id: 1660,
                  title: 'کارت معین',
                  parent: { id: 1372 },
                  type: { code: 1, title: 'منو' },
                  ordering: 6,
                  link: '/certain-bank-card/view',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/certain-bank-card/view',
                },
                {
                  id: 2141,
                  title: 'سایر گزارشات',
                  parent: { id: 1372 },
                  type: { code: 1, title: 'منو' },
                  ordering: 7,
                  link: 'http://192.168.101.171',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: 'http://192.168.101.171',
                },
              ],
            },
            {
              id: 2100,
              title: 'عملیات روزانه',
              type: { code: 1, title: 'منو' },
              ordering: 6,
              link: '/',
              status: { code: 1, title: 'فعال' },
              application: { code: 83, hasAccess: true },
              children: [
                {
                  id: 2080,
                  title: 'عملیات انتهای وقت شعب',
                  parent: { id: 2100 },
                  type: { code: 1, title: 'منو' },
                  ordering: 1,
                  link: '/endTimeReport',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/endTimeReport',
                },
              ],
              url: '/',
              childs: [
                {
                  id: 2080,
                  title: 'عملیات انتهای وقت شعب',
                  parent: { id: 2100 },
                  type: { code: 1, title: 'منو' },
                  ordering: 1,
                  link: '/endTimeReport',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/endTimeReport',
                },
              ],
            },
            {
              id: 2140,
              name: '888',
              title: 'گزارشات تجمیعی',
              type: { code: 1, title: 'منو' },
              ordering: 7,
              link: '/',
              status: { code: 1, title: 'فعال' },
              application: { code: 83, hasAccess: true },
              children: [
                {
                  id: 2225,
                  title: 'مانده تعهدات',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 2,
                  link: '/lc/report/remaining/commitment',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/remaining/commitment',
                },
                {
                  id: 2240,
                  title: 'سر رسید گشایش ها',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 3,
                  link: '/lc/report/dueDate',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/dueDate',
                },
                {
                  id: 2241,
                  title: 'کنترل مانده بدهکاران',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 4,
                  link: '/lc/report/remaining/debt',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/remaining/debt',
                },
                {
                  id: 2242,
                  title: 'پارت های رسیده',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 5,
                  link: '/lc/report/receiveddocs',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/receiveddocs',
                },
                {
                  id: 2243,
                  title: 'کنترل مانده مشکوک الوصول',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 6,
                  link: '/lc/report/remaining/baddebt',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/remaining/baddebt',
                },
                {
                  id: 2244,
                  title: 'تعهدات تسویه',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 7,
                  link: '/lc/report/payoff',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/payoff',
                },
                {
                  id: 2245,
                  title: 'عملکرد مشتری',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 8,
                  link: '/lc/report/customeraction',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/customeraction',
                },
                {
                  id: 2201,
                  name: '۸۸۸',
                  title: 'مانده تعهدات با اخذ وثایق',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 9,
                  link: '/lc/report/remaining/commitment/receivedcollateral',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/remaining/commitment/receivedcollateral',
                  nameWithoutPrefix: '',
                },
                {
                  id: 2343,
                  title: 'سرجمع به تفکیک مدیریت هاو شعب تحت پوشش',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 10,
                  link: '/lc/report/branch',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/branch',
                },
                {
                  id: 2345,
                  title: 'وضعیت بر اساس مشتری',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 11,
                  link: '/lc/report/customer',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/customer',
                },
              ],
              url: '/',
              nameWithoutPrefix: '',
              childs: [
                {
                  id: 2225,
                  title: 'مانده تعهدات',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 2,
                  link: '/lc/report/remaining/commitment',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/remaining/commitment',
                },
                {
                  id: 2240,
                  title: 'سر رسید گشایش ها',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 3,
                  link: '/lc/report/dueDate',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/dueDate',
                },
                {
                  id: 2241,
                  title: 'کنترل مانده بدهکاران',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 4,
                  link: '/lc/report/remaining/debt',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/remaining/debt',
                },
                {
                  id: 2242,
                  title: 'پارت های رسیده',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 5,
                  link: '/lc/report/receiveddocs',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/receiveddocs',
                },
                {
                  id: 2243,
                  title: 'کنترل مانده مشکوک الوصول',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 6,
                  link: '/lc/report/remaining/baddebt',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/remaining/baddebt',
                },
                {
                  id: 2244,
                  title: 'تعهدات تسویه',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 7,
                  link: '/lc/report/payoff',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/payoff',
                },
                {
                  id: 2245,
                  title: 'عملکرد مشتری',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 8,
                  link: '/lc/report/customeraction',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/customeraction',
                },
                {
                  id: 2201,
                  name: '۸۸۸',
                  title: 'مانده تعهدات با اخذ وثایق',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 9,
                  link: '/lc/report/remaining/commitment/receivedcollateral',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/remaining/commitment/receivedcollateral',
                  nameWithoutPrefix: '',
                },
                {
                  id: 2343,
                  title: 'سرجمع به تفکیک مدیریت هاو شعب تحت پوشش',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 10,
                  link: '/lc/report/branch',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/branch',
                },
                {
                  id: 2345,
                  title: 'وضعیت بر اساس مشتری',
                  parent: { id: 2140 },
                  type: { code: 1, title: 'منو' },
                  ordering: 11,
                  link: '/lc/report/customer',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/customer',
                },
              ],
            },
            {
              id: 2403,
              name: '886',
              title: 'عملیات اصلی ورژن دو',
              type: { code: 1, title: 'منو' },
              ordering: 8,
              link: '/',
              status: { code: 1, title: 'فعال' },
              application: { code: 83, hasAccess: true },
              children: [
                {
                  id: 2407,
                  title: 'تسویه قرارداد ورژن دو',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 2,
                  link: '/lc/contractpayoff',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/contractpayoff',
                },
                {
                  id: 2406,
                  title: 'پرداخت وجه به ذینفع ورژن دو',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 3,
                  link: '/lc/sepam/beneficiary/view',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/sepam/beneficiary/view',
                },
                {
                  id: 2405,
                  title: 'تغییرات قرارداد ورژن دو',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 4,
                  link: '/lc/contract/change/view',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/contract/change/view',
                },
                {
                  id: 2404,
                  title: 'ثبت وثایق ورژن دو',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 5,
                  link: '/lc/sepam/collaterals',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/sepam/collaterals',
                },
                {
                  id: 2408,
                  title: 'وصول ورژن دو',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 6,
                  link: '/lc/creditafterduepayoff/view',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/creditafterduepayoff/view',
                },
                {
                  id: 2412,
                  title: 'استعلام ورژن دو',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 7,
                  link: '/lc/requestinquiry/view',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/requestinquiry/view',
                },
                {
                  id: 2423,
                  title: 'تمدید قرارداد ورژن دو',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 8,
                  link: '/lc/contract/respite/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/contract/respite/search',
                },
                {
                  id: 2443,
                  title: 'قرارداد ورژن دو',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 9,
                  link: '/lc/contract/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/contract/search',
                },
                {
                  id: 2447,
                  title: 'ارائه سند حمل',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 10,
                  link: '/lc/transportdocument/view',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/transportdocument/view',
                },
                {
                  id: 2523,
                  title: 'کارتابل',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 11,
                  link: '/lc/dashboard',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/dashboard',
                },
              ],
              url: '/',
              nameWithoutPrefix: '',
              childs: [
                {
                  id: 2407,
                  title: 'تسویه قرارداد ورژن دو',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 2,
                  link: '/lc/payoff/view',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/payoff/view',
                },
                {
                  id: 2406,
                  title: 'پرداخت وجه به ذینفع ورژن دو',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 3,
                  link: '/lc/sepam/beneficiary/view',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/sepam/beneficiary/view',
                },
                {
                  id: 2405,
                  title: 'تغییرات قرارداد ورژن دو',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 4,
                  link: '/lc/contract/change/view',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/contract/change/view',
                },
                {
                  id: 2404,
                  title: 'ثبت وثایق ورژن دو',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 5,
                  link: '/lc/sepam/collaterals',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/sepam/collaterals',
                },
                {
                  id: 2408,
                  title: 'وصول ورژن دو',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 6,
                  link: '/lc/creditafterduepayoff/view',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/creditafterduepayoff/view',
                },
                {
                  id: 2412,
                  title: 'استعلام ورژن دو',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 7,
                  link: '/lc/requestinquiry/view',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/requestinquiry/view',
                },
                {
                  id: 2423,
                  title: 'تمدید قرارداد ورژن دو',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 8,
                  link: '/lc/contract/respite/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/contract/respite/search',
                },
                {
                  id: 2443,
                  title: 'قرارداد ورژن دو',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 9,
                  link: '/lc/contract/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/contract/search',
                },
                {
                  id: 2447,
                  title: 'ارائه سند حمل',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 10,
                  link: '/lc/transportdocument/view',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/transportdocument/view',
                },
                {
                  id: 2523,
                  title: 'کارتابل',
                  parent: { id: 2403 },
                  type: { code: 1, title: 'منو' },
                  ordering: 11,
                  link: '/lc/dashboard',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/dashboard',
                },
              ],
            },
            {
              id: 2260,
              name: '۸۸۹',
              title: 'عملیات سایر بانک ها',
              type: { code: 1, title: 'منو' },
              ordering: 9,
              link: '/',
              status: { code: 1, title: 'فعال' },
              application: { code: 83, hasAccess: true },
              children: [
                {
                  id: 2261,
                  title: 'پیام های سپام سایر بانک ها',
                  parent: { id: 2260 },
                  type: { code: 1, title: 'منو' },
                  ordering: 2,
                  link: '/lc/sepam/otherbank',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/sepam/otherbank',
                },
              ],
              url: '/',
              nameWithoutPrefix: '',
              childs: [
                {
                  id: 2261,
                  title: 'پیام های سپام سایر بانک ها',
                  parent: { id: 2260 },
                  type: { code: 1, title: 'منو' },
                  ordering: 2,
                  link: '/lc/sepam/otherbank',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/sepam/otherbank',
                },
              ],
            },
            {
              id: 2409,
              name: '887',
              title: 'گزارشات ورژن دو',
              type: { code: 1, title: 'منو' },
              ordering: 10,
              link: '/',
              status: { code: 1, title: 'فعال' },
              application: { code: 83, hasAccess: true },
              children: [
                {
                  id: 2411,
                  title: 'پیام 700 بانک تجارت',
                  parent: { id: 2409 },
                  type: { code: 1, title: 'منو' },
                  ordering: 2,
                  link: '/lc/report/message700report/search',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/message700report/search',
                },
                {
                  id: 2410,
                  title: 'جریان اصلی ورژن دو',
                  parent: { id: 2409 },
                  type: { code: 1, title: 'منو' },
                  ordering: 3,
                  link: '/lc/report/mainstream/view',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/mainstream/view',
                },
              ],
              url: '/',
              nameWithoutPrefix: '',
              childs: [
                {
                  id: 2411,
                  title: 'پیام 700 بانک تجارت',
                  parent: { id: 2409 },
                  type: { code: 1, title: 'منو' },
                  ordering: 2,
                  link: '/lc/report/message700report',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/message700report',
                },
                {
                  id: 2410,
                  title: 'جریان اصلی ورژن دو',
                  parent: { id: 2409 },
                  type: { code: 1, title: 'منو' },
                  ordering: 3,
                  link: '/lc/report/mainstream/view',
                  status: { code: 1, title: 'فعال' },
                  application: { code: 83, hasAccess: true },
                  url: '/lc/report/mainstream/view',
                },
              ],
            },
          ],
          now: '1399/11/14',
          parentCode: 933100,
          organType: { code: 3, title: 'شعبه' },
          userRule: ['LC-INQUERY-FETCH-HIGHT-ACCESS'],
        },
        message: null,
      });
    });

    app.use('/log', (req, res) => {
      res.json(logResult);
    });
  }

  return {
    init,
  };
}

module.exports = TataFaker();
