import { all } from "redux-saga/effects";
import { spawnWithRetry } from "../util/saga";
import offlineQueueSaga from "./offlineQueue";
import netInfoSaga from "./netInfo";
import todaySaga from "./today";
// CHANGEME: Push notifications
// import notificationsSaga from "./notifications";
import pushSaga from "./push";
import userSaga from "./user";
import jobSaga from "./job";
import routeSaga from "./route";
import customFieldsSaga from "./customFields";

export default function* rootSaga() {
  yield all(
    [
      offlineQueueSaga,
      netInfoSaga,
      todaySaga,
      // CHANGEME: Push notifications
      // notificationsSaga,
      pushSaga,
      userSaga,
      jobSaga,
      routeSaga,
      customFieldsSaga
    ].map(spawnWithRetry)
  );
}
