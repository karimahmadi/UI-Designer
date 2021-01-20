/*
 *
 * GlobalServices actions
 *
 */

import { SET_CURRENT_USER ,
  SET_TOKEN,
GET_MANAGER,
GET_BRANCH_SUCCESS,
GET_MANAGER_ERROR,
GET_BRANCH,
GET_BRANCH_ERROR,
GET_MANAGER_SUCCESS} from './constants';

export function setCurrentUser(currentUser) {
  return {
    type: SET_CURRENT_USER,
    currentUser
  };
}
export function setToken(token) {
  return {
    type: SET_TOKEN,
    token
  };
}

export function getBranch(branchCode,sc) {
  return {
    type: GET_BRANCH,
    payload: {branchCode,sc},
  };
}

export function getBranchSuccess(response) {
  return {
    type:GET_BRANCH_SUCCESS,
    payload:response,
  };
}

export function getBranchError(error) {
  return {
    type: GET_BRANCH_ERROR,
    payload:error,
  };
}

export function getManager() {
  return {
    type: GET_MANAGER,
  };
}

export function getManagerSuccess(response) {
  return {
    type: GET_MANAGER_SUCCESS,
    payload: response,
  };
}

export function getManagerError(error) {
  return {
    type: GET_MANAGER_ERROR,
    payload: error,
  };
}
