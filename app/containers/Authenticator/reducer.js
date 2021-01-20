/*
 *
 * Authenticator reducer
 *
 */
import produce from 'immer';
import {
  AUTHENTICATE,
  AUTHENTICATE_SUCCESS,
  AUTHENTICATE_FAILED,
} from './constants';

export const initialState = {
  token: '',
};

/* eslint-disable default-case, no-param-reassign */
const authenticatorReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case AUTHENTICATE:
        draft.userLoggedIn = false;
        break;
      case AUTHENTICATE_SUCCESS:
        draft.token = action.token;
        draft.userLoggedIn = true;
        break;
      case AUTHENTICATE_FAILED:
        draft.error = action.error;
        draft.userLoggedIn = false;
        break;
      default:
        return state;
    }
  });

export default authenticatorReducer;
