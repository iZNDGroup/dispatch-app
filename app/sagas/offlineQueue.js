import { takeLatest, put, all, select } from "redux-saga/effects";
import { getOfflineQueue } from "../selectors/offlineQueue";
import { online, resetQueue } from "../actions";

export default function* offlineQueueSaga() {
  yield all([takeLatest(online, processQueue)]);
}

function* processQueue() {
  const offlineQueue = yield select(getOfflineQueue);
  if (offlineQueue && offlineQueue.length > 0) {
    yield* offlineQueue.map(action => put(action));
    yield put(resetQueue());
  }
}
