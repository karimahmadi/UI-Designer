/**
 * Do athentication
 */

import { call, put, takeEvery } from 'redux-saga/effects';
import { AUTHENTICATE } from './constants';
import { authTokenName } from '../../utils/constants';
import { authenticatedSuccess, authenticatedFailed } from './actions';
import KeyCloak from './keycloak';
import KeyCloadJson from './keycloak.json';

function* initKeyCloak() {
  yield new Promise((resolve, reject) => {
    const keycloak = KeyCloak(KeyCloadJson);
    keycloak
      .init({ onLoad: 'login-required', checkLoginIframe: false })
      .success(authenticated => {
        if (authenticated) {
          localStorage.setItem(authTokenName, keycloak.token);
          resolve(keycloak.token);
        }
      })
      .error(err => {
        reject(err);
      });
  });
}

export function* setToken() {
  const token = yield call(initKeyCloak);
  yield put(authenticatedSuccess(token));
}

export default function* authentication() {
  try {
    yield takeEvery(AUTHENTICATE, setToken);
  } catch (err) {
    yield put(authenticatedFailed(err));
    throw new Error(err);
  }
}
