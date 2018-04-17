import { eventChannel, delay } from "redux-saga";
import { take, call, fork, race, cancel, select } from "redux-saga/effects";
import FCM, { FCMEvent } from "react-native-fcm";
import { Platform } from "react-native";
import * as actions from "../actions";
import * as jobsSelector from "../selectors/jobs";
import { updateToken } from "../services/notifications";
import * as navigationService from "../navigation/service";
import { routes } from "../navigation/config";

export default function* notificationsSaga() {
  try {
    let getInitialNotification = true;

    while (true) {
      // Start
      yield take(actions.login.resolve);

      yield call(FCM.requestPermissions);

      const token = yield call(FCM.getFCMToken);
      yield call(onToken, token);

      const listenerTask = yield fork(listener);

      if (getInitialNotification) {
        const notif = yield call(FCM.getInitialNotification);
        yield call(onNotification, { ...notif, opened_from_tray: 1 });
        getInitialNotification = false;
      }

      // Stop
      const closeAction = yield take([actions.logout.init, actions.appClose]);

      if (closeAction.type === actions.logout.init.type) {
        yield call(onToken, null);
      }

      yield cancel(listenerTask);
    }
  } catch (err) {
    console.debug("error", err);
  }
}

function* listener() {
  const channel = eventChannel(emit => {
    const tokenListener = FCM.on(FCMEvent.RefreshToken, token => {
      emit({ type: "token", payload: token });
    });
    const notifListener = FCM.on(FCMEvent.Notification, notif => {
      emit({ type: "notif", payload: notif });
    });
    const unsubscribe = () => {
      notifListener.remove();
      tokenListener.remove();
    };
    return unsubscribe;
  });

  try {
    while (true) {
      const action = yield take(channel);
      switch (action.type) {
        case "token":
          yield call(onToken, action.payload);
          break;
        case "notif":
          yield call(onNotification, action.payload);
          break;
        default:
      }
    }
  } catch (err) {
  } finally {
    channel.close();
  }
}

function* onToken(token) {
  yield call(updateToken, token);
}

function* onNotification(notif) {
  FCM.removeAllDeliveredNotifications();
  if (notif) {
    switch (notif.type) {
      case "openJob":
        yield call(openJob, notif);
        break;
      default:
    }
  }
}

function* openJob(notif) {
  if (notif.opened_from_tray) {
    const jobID = notif.content;
    if (jobID) {
      const { job } = yield race({
        job: call(getJobById, jobID),
        timeout: delay(10000)
      });
      if (job) {
        const navigator = navigationService.getNavigator("jobs");
        if (navigator) {
          navigator.push(routes.jobView(jobID));
        }
      }
    }
  } else {
    const body = Platform.select({
      android: notif.fcm && notif.fcm.body,
      ios: notif.aps && notif.aps.alert
    });
    if (body) {
      FCM.presentLocalNotification({
        body: body,
        type: notif.type,
        content: notif.content,
        show_in_foreground: true,
        priority: "high",
        sound: "default"
      });
    }
  }
}

function* getJobById(id) {
  while (true) {
    const job = yield select(jobsSelector.getById, id);
    if (job) {
      return job;
    }
    yield delay(100);
  }
}
