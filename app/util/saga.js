import { delay } from "redux-saga";
import { call, spawn, all, cancel } from "redux-saga/effects";
import { appendLog } from "../services/logging";

export function* spawnWithRetry(saga) {
  const task = yield spawn(callWithRetry, saga);
  return task;
}

function* callWithRetry(saga) {
  let isSyncError = false;
  let isRetry = false;
  const setErrorType = () => {
    isSyncError = false;
  };
  while (!isSyncError) {
    isSyncError = true;
    try {
      if (isRetry) {
        console.debug("saga retry", saga.name);
        appendLog("saga retry", saga.name);
        isRetry = false;
      }
      setTimeout(setErrorType);
      yield call(saga);
      break;
    } catch (err) {
      if (isSyncError) {
        console.debug("saga sync error", saga.name, err.message);
        appendLog("saga sync error", saga.name, err.message);
        throw new Error("saga sync error - " + saga.name + " - " + err.message);
      } else {
        console.debug("saga async error. retrying...", saga.name, err);
        appendLog("saga async error. retrying...", saga.name, err);
        isRetry = true;
      }
    }
    yield call(delay, 1000);
  }
}

export function* cancelTasks(tasks) {
  yield all(tasks.map(task => cancel(task)));
}
