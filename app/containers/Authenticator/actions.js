/*
 *
 * Authenticator actions
 *
 */

import {
  AUTHENTICATE,
  AUTHENTICATE_SUCCESS,
  AUTHENTICATE_FAILED,
} from './constants';

export function authenticate() {
  return {
    type: AUTHENTICATE,
  };
}
export function authenticatedSuccess(token) {
  return {
    type: AUTHENTICATE_SUCCESS,
    token,
  };
}
export function authenticatedFailed(error) {
  return {
    type: AUTHENTICATE_FAILED,
    error,
  };
}
