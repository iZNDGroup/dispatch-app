import { takeEvery, takeLatest, call, all, put } from "redux-saga/effects";
import * as actions from "../actions";
import * as dispatchService from "../services/dispatch";

export default function* customFieldsSaga() {
  yield all([
    takeLatest(actions.login.resolve, initRequestCustomFields),
    takeEvery(actions.requestCustomFields.init, requestCustomFields)
  ]);
}

function* initRequestCustomFields() {
  yield put(actions.requestCustomFields.init("job"));
  yield put(actions.requestCustomFields.init("route"));
}

function* requestCustomFields(action) {
  const namespace = action.payload;
  try {
    const result = yield call(
      dispatchService.readCustomFieldByApplicationId,
      namespace
    );
    const customFields = result.customFields;
    yield put(actions.requestCustomFields.resolve({ namespace, customFields }));
  } catch (err) {
    yield put(actions.requestCustomFields.reject(err));
  }
}
