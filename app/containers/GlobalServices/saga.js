import { call, put, takeEvery } from 'redux-saga/effects';
import { FETCH_CURRENT_USER } from './constants';
import { requestHandlerGet } from '../../utils/requestHandler';
import { setCurrentUser } from './actions';
function* fetchCurrentUser() {
  const currentUserInfo = yield call(
    requestHandlerGet,
    'rest/security/user/info',
  );
  yield put(setCurrentUser(currentUserInfo.data));
}

export default function* globalServicesSaga() {
  yield takeEvery(FETCH_CURRENT_USER, fetchCurrentUser);
}
