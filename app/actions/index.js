import { createAction, createOptimisticAction } from "../util/redux";

export const appOpen = createAction("app/open");
export const appClose = createAction("app/close");
export const appPause = createAction("app/pause");
export const appResume = createAction("app/resume");

export const jobViewDidMount = createAction("jobView/didMount");
export const jobViewWillUnmount = createAction("jobView/willUnmount");

export const clearErrors = createAction("ui/clearErrors");
export const setIsLoading = createAction("ui/setIsLoading");
export const setNetInfo = createAction("ui/setNetInfo");
export const showAll = createAction("ui/showAll");
export const showPending = createAction("ui/showPending");

export const login = createOptimisticAction("user/login");
export const logout = createOptimisticAction("user/logout");

export const online = createAction("netInfo/online");
export const offline = createAction("netInfo/offline");

export const queue = createAction("offline/queueAction");
export const resetQueue = createAction("offline/resetQueue");

export const batchAddJobs = createAction("push/batchAddJobs");
export const batchRemoveJobs = createAction("push/batchRemoveJobs");
export const batchAddRoutes = createAction("push/batchAddRoutes");
export const batchRemoveRoutes = createAction("push/batchRemoveRoutes");
export const batchAddMetadata = createAction("push/batchAddMetadata");
export const batchRemoveMetadata = createAction("push/batchRemoveMetadata");

export const showNewJobs = createAction("jobs/showNewJobs");
export const clearNewJobs = createAction("jobs/clearNewJobs");

export const requestJob = createOptimisticAction("job/requestJob");
export const startJob = createOptimisticAction("job/startJob");
export const pauseJob = createOptimisticAction("job/pauseJob");
export const finishJobDialog = createAction("job/finishJobDialog");
export const finishJob = createOptimisticAction("job/finishJob");
export const hideJob = createAction("job/hideJob");
export const saveCustomField = createOptimisticAction("job/saveCustomField");
export const downloadMediaCustomFieldFile = createOptimisticAction(
  "job/downloadMediaCustomFieldFile"
);
export const downloadMediaCustomFieldFileProgress = createAction(
  "job/downloadMediaCustomFieldFileProgress"
);
export const uploadMediaCustomFieldFileProgress = createAction(
  "job/uploadMediaCustomFieldFileProgress"
);
export const downloadMediaCustomFieldThumbnails = createOptimisticAction(
  "job/downloadMediaCustomFieldThumbnails"
);
export const uploadMediaCustomFieldFile = createOptimisticAction(
  "job/uploadMediaCustomFieldFile"
);
export const downloadAndOpenWithExternalApp = createAction(
  "job/downloadAndOpenWithExternalApp"
);
export const openFileWithExternalApp = createAction(
  "job/openFileWithExternalApp"
);
export const requestRoute = createOptimisticAction("route/requestRoute");

export const requestCustomFields = createOptimisticAction(
  "customFields/requestCustomFields"
);

export const selectDate = createAction("calendar/selectDate");
export const selectMonth = createAction("calendar/selectMonth");
export const updateToday = createAction("calendar/updateToday");
