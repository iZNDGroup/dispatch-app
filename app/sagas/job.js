import { take, takeEvery, put, call, all, select } from "redux-saga/effects";
import { object } from "../util/immutable";
import { showToast, showDialog } from "../util/ui";
import moment from "moment";
import * as actions from "../actions";
import * as jobsSelector from "../selectors/jobs";
import { Assigned, Active, Completed } from "../services/constants";
import { getReplaySubject, waitForAction } from "../services/push";
import * as dispatchService from "../services/dispatch";
import RNFetchBlob from "react-native-fetch-blob";
import callOptimisticAction from "./callOptimisticAction";
import RpcClient from "../services/client/RpcClient";
import {
  downloadFileSagaHelper,
  uploadFileSagaHelper
} from "../services/media";

export default function* jobSaga() {
  yield all([
    takeEvery(actions.requestJob.init, requestJob),
    takeEvery(actions.startJob.init, startJob),
    takeEvery(actions.pauseJob.init, pauseJob),
    takeEvery(actions.finishJobDialog, finishJobDialog),
    takeEvery(actions.finishJob.init, finishJob),
    takeEvery(actions.saveCustomField.init, saveCustomField),
    takeEvery(
      actions.downloadMediaCustomFiledFile.init,
      downloadMediaCustomFiledFile
    ),
    takeEvery(
      actions.downloadMediaCustomFiledThumbnails.init,
      downloadMediaCustomFiledThumbnails
    ),
    takeEvery(
      actions.uploadMediaCustomFiledFile.init,
      uploadMediaCustomFiledFile
    ),
    takeEvery(
      actions.downloadAndOpenWithExternalApp,
      downloadAndOpenWithExternalApp
    ),
    takeEvery(actions.openFileWithExternalApp, openFileWithExternalApp)
  ]);
}

function* requestJob(action) {
  const jobId = action.payload;
  const subscriptionId = "today";
  try {
    const job = yield select(jobsSelector.getById, jobId);
    if (!job || !job.originalJob) {
      const { subject, unsubscribe } = getReplaySubject();
      try {
        const requestId = yield call(
          dispatchService.queryJob,
          jobId,
          subscriptionId
        );
        yield all([
          call(
            waitForAction,
            subject,
            "JobBroadcast",
            "FailedToQuery",
            requestId
          ),
          take(actions.batchAddJobs)
        ]);
      } finally {
        unsubscribe();
      }
    }
    yield put(actions.requestJob.resolve(action.payload));
  } catch (err) {
    yield put(actions.requestJob.reject(err, { jobId }));
  }
}

function* getJob(jobId) {
  let job = yield select(jobsSelector.getById, jobId);
  if (!job.originalJob) {
    yield put(actions.requestJob.init(jobId, { originalJobOnly: true }));
    yield take(actions.requestJob.resolve);
    job = yield select(jobsSelector.getById, jobId);
  }
  return job;
}

function* startJob(action) {
  yield call(callOptimisticAction, action, function*() {
    const jobId = action.payload;
    const job = yield getJob(jobId);
    const updatedJob = object.merge(job.originalJob, {
      jobState: Active
    });
    const { subject, unsubscribe } = getReplaySubject();
    try {
      const requestId = yield call(dispatchService.updateJob, updatedJob);
      yield all([
        call(waitForAction, subject, "JobUpdated", "FailedToQuery", requestId),
        take(actions.batchAddJobs)
      ]);
      yield put(actions.startJob.resolve(action.payload));
      yield call(showToast, "Job started");
    } catch (err) {
      yield put(actions.startJob.reject(err));
    } finally {
      unsubscribe();
    }
  });
}

function* pauseJob(action) {
  yield call(callOptimisticAction, action, function*() {
    const jobId = action.payload;
    const job = yield getJob(jobId);
    const updatedJob = object.merge(job.originalJob, {
      jobState: Assigned
    });
    const { subject, unsubscribe } = getReplaySubject();
    try {
      const requestId = yield call(dispatchService.updateJob, updatedJob);
      yield all([
        call(waitForAction, subject, "JobUpdated", "FailedToQuery", requestId),
        take(actions.batchAddJobs)
      ]);
      yield put(actions.pauseJob.resolve(action.payload));
      yield call(showToast, "Job paused");
    } catch (err) {
      yield put(actions.pauseJob.reject(err));
    } finally {
      unsubscribe();
    }
  });
}

function* finishJobDialog(action) {
  const jobId = action.payload;
  try {
    const val = yield call(showDialog, "Finish job?", "Job note");
    yield put(actions.finishJob.init({ id: jobId, description: val }));
  } catch (err) {}
}

function* finishJob(action) {
  yield call(callOptimisticAction, action, function*() {
    const { id, description } = action.payload;
    const job = yield getJob(id);
    const updatedJob = object.merge(job.originalJob, {
      jobState: Completed,
      comment: description,
      commentItems: job.originalJob.commentItems.concat([
        {
          commentText: description,
          userName: "user",
          userID: "-1",
          created: moment()
        }
      ])
    });
    const { subject, unsubscribe } = getReplaySubject();
    try {
      const requestId = yield call(dispatchService.updateJob, updatedJob);
      yield all([
        call(waitForAction, subject, "JobUpdated", "FailedToQuery", requestId),
        take(actions.batchAddJobs)
      ]);
      yield put(actions.finishJob.resolve(action.payload));
      yield call(showToast, "Job finished");
    } catch (err) {
      yield put(actions.finishJob.reject(err));
    } finally {
      unsubscribe();
    }
  });
}

function* saveCustomField(action) {
  yield call(callOptimisticAction, action, function*() {
    const { jobId, customFieldId, customFieldValue } = action.payload;
    const job = yield select(jobsSelector.getById, jobId);
    const updatedCustomFields = Object.entries(
      object.set(job.customFields, customFieldId, customFieldValue)
    ).map(([Key, Value]) => ({ Key, Value }));
    const customFields =
      updatedCustomFields.length > 0
        ? JSON.stringify(updatedCustomFields)
        : null;
    const updatedJob = object.merge(job.originalJob, {
      customFields
    });
    const { subject, unsubscribe } = getReplaySubject();
    try {
      const requestId = yield call(dispatchService.updateJob, updatedJob);
      yield all([
        call(waitForAction, subject, "JobUpdated", "FailedToQuery", requestId),
        take(actions.batchAddJobs)
      ]);
      yield put(actions.saveCustomField.resolve(action.payload));
      yield call(showToast, "Job saved");
    } catch (err) {
      yield put(actions.saveCustomField.reject(err));
    } finally {
      unsubscribe();
    }
  });
}

function* downloadMediaCustomFiledThumbnails(action) {
  try {
    var separatorIndex = action.payload.filename.lastIndexOf(".");
    var filename =
      action.payload.filename.substring(0, separatorIndex) +
      "_thumb." +
      action.payload.filename.split(".").pop();
    const params = {
      fieldid: action.payload.fieldid,
      joborrouteid: action.payload.jobOrRouteId,
      type: action.payload.cfNamespace,
      appId: RpcClient.applicationId.toString(),
      filename: filename,
      fieldKey: action.payload.fieldid,
      filePath: null
    };
    let dirs = RNFetchBlob.fs.dirs;
    const req = RNFetchBlob.config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      fileCache: true,
      // appendExt : ext,
      path: dirs.DocumentDir + "/" + filename
    });

    const res = yield call(
      [req, req.fetch],
      "POST",
      RpcClient.baseUrl + "/comGpsGate/rpc/DispatchMediaDownload",
      params
    );
    console.debug("file saved", res.path());

    params.filePath = res.path();

    yield put(actions.downloadMediaCustomFiledThumbnails.resolve(params));
  } catch (err) {
    console.debug("### <- downloadMediaCustomFiledThumbnails error", err);
    throw err;
  }
}

function openFileWithExternalApp(action) {
  const { filePath } = action.payload;

  var extension = filePath.split(".").pop();

  var mimetype;
  switch (
    extension // mime type
  ) {
    case "mp4":
      mimetype = "video/mp4";
      break;
    case "avi":
      mimetype = "video/x-msvideo";
      break;
    case "wmv":
      mimetype = "video/x-ms-wmv";
      break;
    case "ogv":
      mimetype = "video/ogg";
      break;
    case "webm":
      mimetype = "video/webm";
      break;
    default:
      mimetype = "application/octet-stream";
      break;
  }

  var filename = filePath.split("/").pop(); // get the filename
  const FileOpener = require("react-native-file-opener");
  var RNFS = require("react-native-fs");

  var newpath = RNFS.ExternalDirectoryPath + "/" + filename;
  RNFS.moveFile(filePath, newpath);

  if (RNFS.exists(newpath)) {
    // if the file is exists
    FileOpener.open(
      // we can open it
      newpath,
      mimetype
    ).then(
      msg => {
        console.debug("success");
      },
      ex => {
        console.debug("error", ex);
      }
    );
  }
}

function* downloadAndOpenWithExternalApp(action) {
  try {
    const params = {
      fieldid: action.payload.fieldid,
      joborrouteid: action.payload.jobOrRouteId,
      type: action.payload.cfNamespace,
      appId: RpcClient.applicationId.toString(),
      filename: action.payload.filename,
      fieldKey: action.payload.fieldid,
      filePath: null
    };

    let dirs = RNFetchBlob.fs.dirs;
    let url = RpcClient.baseUrl + "/comGpsGate/rpc/DispatchMediaDownload";
    let filePath = dirs.DocumentDir + "/" + action.payload.filename;

    const channel = yield call(
      downloadFileSagaHelper,
      params,
      url,
      filePath,
      actions.downloadMediaCustomFiledFileProgress,
      actions.openFileWithExternalApp,
      actions.downloadMediaCustomFiledFile.reject
    );
    try {
      while (true) {
        const action = yield take(channel);
        yield put(action);
      }
    } catch (error) {
      put(actions.downloadMediaCustomFiledFile.reject(error));
    } finally {
      // Optional
    }

    params.filePath = filePath;

    yield put(actions.downloadMediaCustomFiledFile.resolve(params));
  } catch (err) {
    throw err;
  }
}

function* downloadMediaCustomFiledFile(action) {
  try {
    const params = {
      fieldid: action.payload.fieldid,
      joborrouteid: action.payload.jobOrRouteId,
      type: action.payload.cfNamespace,
      appId: RpcClient.applicationId.toString(),
      filename: action.payload.filename,
      fieldKey: action.payload.fieldid,
      filePath: null
    };
    let dirs = RNFetchBlob.fs.dirs;

    var url = RpcClient.baseUrl + "/comGpsGate/rpc/DispatchMediaDownload";
    var filePath = dirs.DocumentDir + "/" + action.payload.filename;

    const channel = yield call(
      downloadFileSagaHelper,
      params,
      url,
      filePath,
      actions.downloadMediaCustomFiledFileProgress,
      actions.downloadMediaCustomFiledFile.resolve,
      actions.downloadMediaCustomFiledFile.reject
    );
    try {
      while (true) {
        const action = yield take(channel);
        yield put(action);
      }
    } catch (error) {
      put(actions.downloadMediaCustomFiledFile.reject(error));
    } finally {
      // Optional
    }

    params.filePath = filePath;

    yield put(actions.downloadMediaCustomFiledFile.resolve(params));
  } catch (err) {
    throw err;
  }
}

function* uploadMediaCustomFiledFile(action) {
  try {
    const params = {
      fieldid: action.payload.fieldid,
      joborrouteid: action.payload.jobOrRouteId,
      type: action.payload.cfNamespace,
      appId: RpcClient.applicationId.toString(),
      filename: action.payload.filename,
      fieldKey: action.payload.fieldid,
      filePath: action.payload.filePath,
      uploadableFile: action.payload.uploadFile,
      "Content-Type": "multipart/form-data"
    };

    var url = RpcClient.baseUrl + "/comGpsGate/rpc/DispatchMediaUpload";

    const channel = yield call(
      uploadFileSagaHelper,
      params,
      url,
      actions.uploadMediaCustomFiledFileProgress,
      actions.downloadMediaCustomFiledFile.resolve,
      actions.downloadMediaCustomFiledFile.reject
    );
    try {
      while (true) {
        const action = yield take(channel);
        yield put(action);
      }
    } catch (error) {
      put(actions.downloadMediaCustomFiledFile.reject(error));
    } finally {
      // Optional
    }
  } catch (err) {
    console.debug("### <- uploadMediaCustomFiledFile error", err);
    throw err;
  }
}
