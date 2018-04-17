import Rx from "rxjs/Rx";
import PushClient from "./client/PushClient";
import * as dispatchService from "../services/dispatch";

let pushClient = null;
let observable = null;
let subject = null;
let subscription = null;
let subscriptions = {};

export const open = (baseUrl, applicationId) => {
  if (pushClient) {
    throw new Error("open");
  }
  // console.debug("### pushService.open", baseUrl, applicationId);
  // PushClient.DEBUG = true;
  pushClient = new PushClient(
    baseUrl,
    applicationId,
    openCallback,
    errorCallback
  );
  observable = Rx.Observable.fromEventPattern(
    addHandler,
    removeHandler
  ).mergeMap(payload => payload);
  subject = new Rx.Subject();
  pushClient.open();
};

export const close = () => {
  if (!pushClient) {
    throw new Error("close");
  }
  // console.debug("### pushService.close");
  clearSubscriptions();
  disposeObservable();
  pushClient.close();
  pushClient = null;
};

const openCallback = () => {
  if (!subject) {
    throw new Error("openCallback");
  }
  // console.debug("### pushService.openCallback");
  createObservable();
  subject.next({ action: "Open" });
};

const errorCallback = () => {
  if (!subject) {
    throw new Error("errorCallback");
  }
  // console.debug("### pushService.errorCallback");
  subject.next({ action: "Error" });
};

const addHandler = handler => {
  if (!pushClient) {
    throw new Error("addHandler");
  }
  const signal = pushClient.subscribe("Dispatch_Stream", handler);
  return signal;
};

const removeHandler = (handler, signal) => {
  if (!pushClient) {
    throw new Error("removeHandler");
  }
  pushClient.unsubscribe("Dispatch_Stream", signal.id);
};

const createObservable = () => {
  if (!observable) {
    throw new Error("createObservable");
  }
  subscription = observable.subscribe(subject);
};

const disposeObservable = () => {
  if (!subscription) {
    throw new Error("disposeObservable");
  }
  subscription.unsubscribe();
  subscription = null;
};

export const getObservable = () => {
  if (!subject) {
    throw new Error("getObservable");
  }
  return subject;
};

export const getReplaySubject = () => {
  const subject = new Rx.ReplaySubject();
  const subscription = getObservable().subscribe(payload => {
    subject.next(payload);
  });
  return {
    subject,
    unsubscribe: () => {
      subscription.unsubscribe();
    }
  };
};

export const waitForAction = (
  subject,
  successAction,
  failureAction,
  requestId
) => {
  return subject
    .filter(
      payload =>
        (payload.action === successAction ||
          payload.action === failureAction) &&
        payload.requestId === requestId
    )
    .timeout(10000)
    .first()
    .do(payload => {
      if (payload.action === failureAction) {
        throw new Error(payload.reason);
      }
    })
    .map(payload => payload.action === successAction)
    .toPromise();
};

export const subscribeToUser = (
  subscriptionId,
  startTime,
  endTime,
  includeUnscheduled,
  workerId
) => {
  const fn = async () => {
    await dispatchService.subscribeToUser(
      subscriptionId,
      startTime,
      endTime,
      includeUnscheduled,
      workerId
    );
  };
  return _subscribe(subscriptionId, fn);
};

export const subscribeMetadata = (startTime, endTime, workerId) => {
  const subscriptionId = "metadata";
  const fn = async () => {
    await dispatchService.subscribeMetadata(startTime, endTime, workerId);
  };
  return _subscribe(subscriptionId, fn);
};

const _subscribe = async (subscriptionId, fn) => {
  // if (subscriptions[subscriptionId]) {
  //   clearInterval(subscriptions[subscriptionId])
  // }
  await unsubscribe(subscriptionId);
  const promise = waitForSubscribed(subscriptionId);
  await fn();
  subscriptions[subscriptionId] = setInterval(fn, 60000); // 60000 = 1 min
  return promise;
};

export const unsubscribe = async subscriptionId => {
  if (subscriptions[subscriptionId]) {
    clearInterval(subscriptions[subscriptionId]);
    delete subscriptions[subscriptionId];
  }
  const promise = waitForUnsubscribed(subscriptionId);
  await dispatchService.unsubscribe(subscriptionId);
  return promise;
};

const clearSubscriptions = () => {
  Object.keys(subscriptions).forEach(subscriptionId => {
    clearInterval(subscriptions[subscriptionId]);
    delete subscriptions[subscriptionId];
  });
};

const waitFor = filter => {
  return getObservable()
    .filter(filter)
    .timeout(10000)
    .first()
    .toPromise();
};

const waitForSubscribed = subscriptionId => {
  return waitFor(
    payload =>
      (payload.action === "Subscribed" ||
        payload.action === "Resubscribed" ||
        payload.action === "FailedToSubscribe") &&
      payload.subscriptionId === subscriptionId
  );
};

const waitForUnsubscribed = subscriptionId => {
  return waitFor(
    payload =>
      (payload.action === "Unsubscribed" ||
        payload.action === "FailedToUnsubscribe") &&
      payload.subscriptionId === subscriptionId
  );
};
