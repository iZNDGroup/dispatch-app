import { delay, eventChannel } from "redux-saga";
import {
  take,
  takeLatest,
  put,
  call,
  fork,
  all,
  cancel,
  select
} from "redux-saga/effects";
import moment from "moment";
import * as actions from "../actions";
import * as userSelector from "../selectors/user";
import * as calendarSelector from "../selectors/calendar";
import * as jobsSelector from "../selectors/jobs";
import * as pushService from "../services/push";
import * as userService from "../services/user";

export default function* pushSaga() {
  while (true) {
    yield take(actions.login.resolve);

    // Open
    const { baseUrl } = yield call(userService.getUserData);
    const applicationId = yield select(userSelector.getApplicationId);
    yield call(pushService.open, baseUrl, applicationId);

    // Tasks
    const tasks = [
      yield fork(isLoading),
      yield fork(updateToday),
      yield takeLatest(actions.selectDate, subscribeDate),
      yield takeLatest(actions.selectMonth, subscribeMetadata),
      yield fork(listener, null, 0, debugHandler),
      yield fork(listener, ["Open"], 0, openCallback),
      yield fork(listener, ["Error"], 0, errorCallback),
      yield fork(listener, ["JobBroadcast", "JobUpdated"], 1000, batchAddJobs),
      yield fork(listener, ["JobRemoved"], 1000, batchRemoveJobs),
      yield fork(
        listener,
        ["RouteBroadcast", "RouteUpdated"],
        1000,
        batchAddRoutes
      ),
      yield fork(listener, ["RouteRemoved"], 1000, batchRemoveRoutes),
      yield fork(listener, ["JobMetadataAdd"], 1000, batchAddMetadata),
      yield fork(listener, ["JobMetadataRemove"], 1000, batchRemoveMetadata)
    ];

    // Close
    yield take([actions.logout.resolve, actions.appClose]);
    yield all(tasks.map(task => cancel(task)));
    yield call(pushService.close);
  }
}

function* openCallback() {
  yield put(actions.online());

  yield call(subscribeToday);

  const tomorrow = moment()
    .add(1, "d")
    .startOf("day");
  yield put(actions.selectDate(tomorrow));
  yield put(actions.selectMonth(tomorrow));
}

function* errorCallback() {
  yield put(actions.offline("Server Unavailable"));
}

function* batchAddJobs(buffer) {
  const jobs = buffer.map(payload => payload.dispatchJob);
  yield put(actions.batchAddJobs(jobs));
}

function* batchRemoveJobs(buffer) {
  const stateJobs = yield select(jobsSelector.getAll);
  const removeJobs = buffer
    .map(payload => stateJobs[payload.jobId])
    .filter(job => job);
  yield put(actions.batchRemoveJobs(removeJobs));
}

function* batchAddRoutes(buffer) {
  const routes = buffer.map(payload => payload.dispatchRoute);
  yield put(actions.batchAddRoutes(routes));
}

function* batchRemoveRoutes(buffer) {
  const routeIds = buffer.map(payload => payload.routeId);
  yield put(actions.batchRemoveRoutes(routeIds));
}

function* batchAddMetadata(buffer) {
  const metadata = buffer.map(payload => payload.metadata);
  yield put(actions.batchAddMetadata(metadata));
}

function* batchRemoveMetadata(buffer) {
  const metadata = buffer.map(payload => payload.metadata);
  yield put(actions.batchRemoveMetadata(metadata));
}

function* isLoading() {
  yield call(delay, 10000);
  yield put(actions.setIsLoading(false));
}

function* updateToday() {
  while (true) {
    const todayBefore = yield select(calendarSelector.getToday);
    yield take(actions.updateToday);
    const todayAfter = yield select(calendarSelector.getToday);
    if ((!todayBefore && todayAfter) || !todayBefore.isSame(todayAfter, "d")) {
      yield call(subscribeToday);
    }
  }
}

function* subscribeToday() {
  const today = yield select(calendarSelector.getToday);
  const startTime = moment(today).startOf("day");
  const endTime = moment(today).endOf("day");
  const includeUnscheduled = true;
  const workerId = yield select(userSelector.getUserId);
  yield call(
    pushService.subscribeToUser,
    "today",
    startTime,
    endTime,
    includeUnscheduled,
    workerId
  );
}

function* subscribeDate(action) {
  let date = action && action.payload;
  if (!date) {
    date = moment();
  }
  const startTime = moment(date).startOf("day");
  const endTime = moment(date).endOf("day");
  const includeUnscheduled = false;
  const workerId = yield select(userSelector.getUserId);
  yield call(
    pushService.subscribeToUser,
    "calendar",
    startTime,
    endTime,
    includeUnscheduled,
    workerId
  );
}

function* subscribeMetadata(action) {
  let date = action && action.payload;
  if (!date) {
    date = moment();
  }
  const startTime = moment(date).startOf("month");
  const endTime = moment(date).endOf("month");
  const workerId = yield select(userSelector.getUserId);
  yield call(pushService.subscribeMetadata, startTime, endTime, workerId);
}

// TODO: remove
function debugHandler(buffer) {
  const knownActions = [
    "Subscribed",
    "Unsubscribed",
    "Resubscribed",
    "JobBroadcast",
    "JobUpdated",
    "JobFailedToUpdate",
    "RouteBroadcast",
    "RouteUpdated",
    "RouteFailedToUpdate",
    "JobRemoved",
    "JobFailedToRemove",
    "RouteRemoved",
    "RouteFailedToRemove",
    "FailedToQuery",
    "UpdateStats",
    "Open",
    "Error",
    "JobMetadataAdd",
    "JobMetadataRemove"
  ];
  buffer.forEach(payload => {
    if (!knownActions.includes(payload.action)) {
      console.debug("unknown message", payload);
    }
  });
}

function* listener(actionFilter, bufferTime, handler) {
  const channel = yield call(createChannel, actionFilter, bufferTime);
  try {
    while (true) {
      const buffer = yield take(channel);
      yield* handler(buffer);
    }
  } catch (err) {
  } finally {
    channel.close();
  }
}

const createChannel = (actionFilter, bufferTime) => {
  return eventChannel(emit => {
    const observable = pushService
      .getObservable()
      .filter(({ action }) => !actionFilter || actionFilter.includes(action)) // TODO: revert after removing debugHandler
      .bufferTime(bufferTime);
    const observer = buffer => {
      if (buffer.length > 0) {
        emit(buffer);
      }
    };
    const subscription = observable.subscribe(observer);
    const unsubscribe = () => {
      subscription.unsubscribe();
    };
    return unsubscribe;
  });
};
