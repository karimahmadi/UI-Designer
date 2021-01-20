import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the globalServices state domain
 */

const selectGlobalServicesDomain = state =>
  state.globalServices || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by GlobalServices
 */

const makeSelectGlobalServices = () =>
  createSelector(
    selectGlobalServicesDomain,
    substate => substate,
  );
const makeSelectCurrentUser = () =>
  createSelector(
    selectGlobalServicesDomain,
    substate => substate.currentUser,
  );

export default makeSelectGlobalServices;
export { selectGlobalServicesDomain, makeSelectCurrentUser };
