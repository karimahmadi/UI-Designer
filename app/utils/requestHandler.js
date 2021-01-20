import { mergeDeep } from './helper';
const axios = require('axios');
const restConfig = require('../../rest.config');

const instance = axios.create();

export const AJAX_STARTED = 'tatareact/utils/AJAX_STARTED';
export const AJAX_STOPED = 'tatareact/utils/AJAX_STOPED';

instance.interceptors.request.use(
  config => {
    if (!config.headers.ignoreProgress) {
      document.dispatchEvent(new CustomEvent(AJAX_STARTED));
    }
    return mergeDeep(config, restConfig.default());
  },
  error => {
    if (!error.config.headers.ignoreProgress) {
      document.dispatchEvent(new CustomEvent(AJAX_STOPED));
    }
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  response => {
    if (!response.config.headers.ignoreProgress) {
      document.dispatchEvent(new CustomEvent(AJAX_STOPED));
    }
    if (response.status === 204 || response.status === 205) {
      return null;
    }
    if (response.status >= 200 && response.status < 300) {
      return { status: response.status, data: response.data };
    }
    return null;
  },
  error => {
    if (!error.config.headers.ignoreProgress) {
      document.dispatchEvent(new CustomEvent(AJAX_STOPED));
    }
    return Promise.reject({
      status: error.response.status,
      data: error.response.data,
    });
  },
);

/**
 *Request a URL and params do a GET request then return a Promise
 * @param {string} url: service URL
 * @param {object} options
 * this request handler need authentication operation
 */
export function requestHandlerGet(url, options) {
  return instance.get(url, options);
}

/**
 *Request a URL and params do a POST request then return a Promise
 * @param {string} url: service URL
 * @param {object} inputData: axios post data
 * @param {object} options: axios post options
 * this request handler doesn't need authentication operation
 */
export function requestHandlerPost(url, inputData = {}, options) {
  return instance.post(url, inputData, options);
}

/**
 *Request a url, method, params or data do ANY request then return a Promise
 * @param {string} url: relative url
 * @param {string} method: can be post or get
 * @param {object} params: array of query string, used when method is get
 * @param {object} data: json of body request, used when method is post
 * @param {object} headers: axios headers
 * this request handler doesn't need authentication operation
 */
export function requestHandler(url, method, params, data, headers) {
  return instance({
    method,
    url,
    params,
    data,
    headers,
  });
}

export function requestHandlerOptions(options) {
  return instance(options);
}
