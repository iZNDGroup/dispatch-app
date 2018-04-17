import { NetInfo } from "react-native";
import { eventChannel } from "redux-saga";
import { take, takeLatest, put, all } from "redux-saga/effects";
import * as actions from "../actions";

export default function* netInfoSaga() {
  yield all([
    takeLatest(actions.login.resolve, netInfo),
    takeLatest(actions.online, online),
    takeLatest(actions.offline, offline)
  ]);
}

function* netInfo() {
  const channel = eventChannel(emit => {
    const netInfoChange = isConnected => {
      emit(isConnected);
    };
    NetInfo.isConnected.fetch().then(netInfoChange);
    NetInfo.isConnected.addEventListener("change", netInfoChange);
    const unsubscribe = () => {
      NetInfo.isConnected.removeEventListener("change", netInfoChange);
    };
    return unsubscribe;
  });

  try {
    while (true) {
      const isConnected = yield take(channel);
      if (!isConnected) {
        yield put(actions.offline("No Internet Connection"));
      }
    }
  } catch (err) {
  } finally {
    channel.close();
  }
}

function* online() {
  yield put(actions.setNetInfo(null));
}

function* offline(action) {
  const statusText = action.payload;
  yield put(actions.setNetInfo(statusText));
}
