import { delay } from "redux-saga";
import { take, put, call, race } from "redux-saga/effects";
import * as actions from "../actions";

export default function* todaySaga() {
  while (true) {
    yield race({
      login: take(actions.login.resolve),
      timeout: call(delay, 60000)
    });
    yield put(actions.updateToday());
  }
}
