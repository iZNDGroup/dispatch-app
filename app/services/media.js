import { Platform } from "react-native";
import { eventChannel, END } from "redux-saga";
import RNFetchBlob from "react-native-fetch-blob";

// File downloader for custom fields
export const downloadFileSagaHelper = (
  _params,
  url,
  filePath,
  progressAction,
  resolveAction,
  errorAction
) => {
  // An event channel will let you send an infinite number of events
  // It provides you with an emitter to send these events
  // These events can then be picked up by a saga through a "take" method
  return eventChannel(emitter => {
    RNFetchBlob.config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      path: filePath,
      fileCache: true
    })
      .fetch("POST", url, _params)
      .progress({ interval: 200 }, (received, total) => {
        const progress = received / total * 100;
        // I chose to emit actions immediately
        _params.progress = progress;
        emitter({
          type: progressAction.type, // 'job/downloadMediaCustomFiledFileProgress',
          payload: _params
        });
      })
      .then(res => {
        // the temp file path
        _params.filePath = res.path().split("|")[0];
        emitter({
          type: resolveAction.type, // 'job/downloadMediaCustomFiledFile/resolve',
          payload: _params
        });
        _params.progress = null;
        emitter({
          type: progressAction.type, // 'job/downloadMediaCustomFiledFileProgress',
          payload: _params
        });
        emitter(END);
      })
      .catch(err => {
        console.debug("error", err);
        emitter({
          type: errorAction.type,
          payload: _params
        });
        _params.progress = null;
        emitter({
          type: progressAction.type, // 'job/downloadMediaCustomFiledFileProgress',
          payload: _params
        });
        emitter(END);
      });

    return () => {};
  });
};

// File uloader for custom fields
export const uploadFileSagaHelper = (
  _params,
  url,
  progressAction,
  resolveAction,
  errorAction
) => {
  // An event channel will let you send an infinite number of events
  // It provides you with an emitter to send these events
  // These events can then be picked up by a saga through a "take" method
  return eventChannel(emitter => {
    _params.progress = 0;
    emitter({
      type: progressAction.type,
      payload: _params
    });

    var cleanUri = _params.filePath;
    if (Platform.OS !== "android") {
      // var prefixIndex = url.indexOf("file:///")
      cleanUri = _params.filePath.substring("file:///".length);
    }
    var uploadable;
    //var binary;
    if (_params.filePath === "base64") {
      uploadable = _params.uploadableFile.replace(/\n|\r/g, "");
      _params.uploadableFile = undefined;
      //_params.filePath="data:image/png;base64,"+uploadable
    }

    RNFetchBlob.config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      // path: filePath,
      // fileCache: true,
    })
      .fetch("POST", url, _params, [
        {
          name: _params.filename,
          filename: _params.filename,
          type: "image/png;BASE64",
          data:
            _params.filePath !== "base64"
              ? RNFetchBlob.wrap(cleanUri)
              : uploadable
        },
        { name: "joborrouteid", data: _params.joborrouteid },
        { name: "type", data: _params.type },
        { name: "appId", data: _params.appId },
        { name: "fieldKey", data: _params.fieldKey }
      ])
      .uploadProgress({ interval: 200 }, (written, total) => {
        const progress = written / total * 100;
        // I chose to emit actions immediately
        _params.progress = progress;
        console.debug("progress", progress);
        emitter({
          type: progressAction.type,
          payload: _params
        });
      })
      .then(res => {
        // the temp file path
        // _params.filePath = res.path();
        emitter({
          type: resolveAction.type,
          payload: _params
        });
        console.debug("file uploaded", _params.filePath);
        _params.progress = null;
        emitter({
          type: progressAction.type,
          payload: _params
        });

        emitter({
          type: "showToast",
          payload: "File saved"
        });
        emitter(END);
      })
      .catch(err => {
        console.debug("error", err);
        emitter({
          type: "showToast",
          payload: err
        });
        emitter({
          type: errorAction.type,
          payload: _params
        });
        _params.progress = null;
        emitter({
          type: progressAction.type,
          payload: _params
        });
        emitter(END);
      });

    return () => {};
  });
};
