/*
 *
 * GlobalServices reducer
 *
 */
import produce from 'immer';
import { SET_CURRENT_USER } from './constants';

export const initialState = {
  currentUser: {},
  branchTitle: '',
  branchManagement: {
    organManagementDto: [],
    organResponse: {},
  },
};

/* eslint-disable default-case, no-param-reassign */
const globalServicesReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_CURRENT_USER:
        draft.currentUser = action.currentUser;
        break;
    }
  });

export default globalServicesReducer;
