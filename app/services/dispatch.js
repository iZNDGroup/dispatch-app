import RpcClient from "./client/RpcClient";
import { CustomFieldNamespaceMap } from "./constants";
import { appendLog } from "./logging";

const service = "Dispatch";

export const subscribeToUser = async (
  subscriptionId,
  startTime,
  endTime,
  includeUnscheduled,
  workerId
) => {
  // console.debug('### -> subscribeToUser', subscriptionId, startTime.format('YYYYMMDD'), endTime.format('YYYYMMDD'), includeUnscheduled, workerId)
  try {
    await RpcClient.request(service, "SubscribeToUser", {
      requestedSubscriptionId: subscriptionId,
      startTime: startTime.toDate(),
      endTime: endTime.toDate(),
      includeUnscheduled: includeUnscheduled,
      workerId: workerId
    });
  } catch (err) {
    console.debug("### <- subscribeToUser error", err);
    appendLog("### <- subscribeToUser error", err);
  }
};

export const subscribeMetadata = async (startTime, endTime, workerId) => {
  // console.debug('### -> subscribeMetadata', startTime.format('YYYYMMDD'), endTime.format('YYYYMMDD'), workerId)
  try {
    await RpcClient.request(service, "SubscribeMetadata", {
      startTime: startTime.toDate(),
      endTime: endTime.toDate(),
      workerId: workerId
    });
  } catch (err) {
    console.debug("### <- subscribeMetadata error", err);
    appendLog("### <- subscribeMetadata error", err);
  }
};

export const unsubscribe = async subscriptionId => {
  // console.debug('### -> unsubscribe', subscriptionId)
  try {
    await RpcClient.request(service, "UnsubscribeToOne", {
      subscriptionId: subscriptionId
    });
  } catch (err) {
    console.debug("### <- unsubscribe error", err);
    appendLog("### <- unsubscribe error", err);
  }
};

export const queryJob = async (jobId, subscriptionId) => {
  // console.debug('### -> queryJob', jobId, subscriptionId)
  try {
    const result = await RpcClient.request(service, "QueryJob", {
      jobId: jobId,
      responseSubscriptionId: subscriptionId
    });
    return result;
  } catch (err) {
    console.debug("### <- queryJob error", err);
    throw err;
  }
};

export const updateJob = async job => {
  // console.debug('### -> updateJob', job)
  try {
    const result = await RpcClient.request(service, "UpdateJob", {
      job: job
    });
    return result;
  } catch (err) {
    console.debug("### <- updateJob error", err);
    throw err;
  }
};

export const queryRoute = async (routeId, subscriptionId) => {
  // console.debug('### -> queryRoute', routeId, subscriptionId)
  try {
    const result = await RpcClient.request(service, "QueryRoute", {
      routeId: routeId,
      responseSubscriptionId: subscriptionId
    });
    return result;
  } catch (err) {
    console.debug("### <- queryRoute error", err);
    throw err;
  }
};

export const readCustomFieldByApplicationId = async namespace => {
  // console.debug('### -> readCustomFieldByApplicationId', namespace)
  try {
    const result = await RpcClient.request(
      service,
      "ReadCustomFieldByApplicationId",
      {
        cfNamespace: CustomFieldNamespaceMap[namespace]
      }
    );
    return result;
  } catch (err) {
    console.debug("### <- readCustomFieldByApplicationId error", err);
    throw err;
  }
};

export const updateFCMToken = async (token, deviceType) => {
  // console.debug('### -> updateFCMToken', token)
  try {
    const result = await RpcClient.request(service, "UpdateFCMToken", {
      token,
      deviceType
    });
    return result;
  } catch (err) {
    console.debug("### <- updateFCMToken error", err);
    appendLog("### <- updateFCMToken error", err);
    throw err;
  }
};

export const removeFCMToken = async token => {
  // console.debug('### -> removeFCMToken', token)
  try {
    const result = await RpcClient.request(service, "RemoveFCMToken", {
      token
    });
    return result;
  } catch (err) {
    console.debug("### <- removeFCMToken error", err);
    appendLog("### <- removeFCMToken error", err);
    throw err;
  }
};
