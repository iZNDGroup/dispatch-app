import { put, call, select } from "redux-saga/effects";
import { collection } from "../util/immutable";
import { queue } from "../actions";
import { getNetInfo } from "../selectors/ui";

export default function* callOptimisticAction(action, callback) {
  const { isConnected } = yield select(getNetInfo);
  if (isConnected) {
    yield call(callback);
  } else {
    const actionToQueue = collection.mergeIn(action, ["meta"], {
      skipOptimistic: true
    });
    yield put(queue(actionToQueue));
  }
}
