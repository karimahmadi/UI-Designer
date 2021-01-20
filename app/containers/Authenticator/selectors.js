import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the authenticator state domain
 */

const selectAuthenticatorDomain = state => state.authenticator || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Authenticator
 */

const makeSelectAuthenticator = () =>
  createSelector(
    selectAuthenticatorDomain,
    substate => substate,
  );
const makeSelectUserLoggedIn = () =>
  createSelector(
    selectAuthenticatorDomain,
    substate => substate.userLoggedIn,
  );

export default makeSelectAuthenticator;
export { selectAuthenticatorDomain, makeSelectUserLoggedIn };
