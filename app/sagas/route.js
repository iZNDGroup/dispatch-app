import { take, takeEvery, put, call, all, select } from "redux-saga/effects";
import * as actions from "../actions";
import * as routesSelector from "../selectors/routes";
import { getReplaySubject, waitForAction } from "../services/push";
import * as dispatchService from "../services/dispatch";

export default function* routeSaga() {
  yield all([takeEvery(actions.requestRoute.init, requestRoute)]);
}

function* requestRoute(action) {
  const routeId = action.payload;
  const subscriptionId = "today";
  try {
    const route = yield select(routesSelector.getById, routeId);
    if (!route.isFull) {
      const { subject, unsubscribe } = getReplaySubject();
      try {
        const requestId = yield call(
          dispatchService.queryRoute,
          routeId,
          subscriptionId
        );
        yield all([
          call(
            waitForAction,
            subject,
            "RouteBroadcast",
            "FailedToQuery",
            requestId
          ),
          call(
            waitForAction,
            subject,
            "JobBroadcast",
            "FailedToQuery",
            requestId
          ),
          take(actions.batchAddRoutes),
          take(actions.batchAddJobs)
        ]);
      } finally {
        unsubscribe();
      }
    }
    yield put(actions.requestRoute.resolve(action.payload));
  } catch (err) {
    yield put(actions.requestRoute.reject(err));
  }
}
