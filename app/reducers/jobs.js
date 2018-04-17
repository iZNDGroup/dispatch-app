import moment from "moment";
import { createReducer, createOptimisticReducer } from "../util/redux";
import { collection, object } from "../util/immutable";
import * as actions from "../actions";
import { JobStateMap } from "../services/constants";

const byIdReducer = createOptimisticReducer(
  {},
  {
    [actions.batchAddJobs]: (state, action) => {
      const newState = action.payload.reduce((obj, job) => {
        const oldJob = collection.getIn(state, [job.id]) || {};
        let newJob;
        if (oldJob.originalJobOnly) {
          newJob = object.merge(oldJob, {
            originalJob: job.hasOwnProperty("createdTime") ? job : null // isFull
          });
        } else {
          newJob = object.merge(oldJob, {
            id: job.id,
            title: job.description,
            description: job.comment,
            location: getLocation(job.startLocation),
            scheduledTime: job.scheduledTime ? moment(job.scheduledTime) : null,
            date: moment(job.scheduledTime || job.completedTime || undefined),
            status: JobStateMap[job.jobState],
            customFields: getCustomFields(job.customFields),
            routeId: job.routeID,
            originalJob: job.hasOwnProperty("createdTime") ? job : null, // isFull,
            commentItems: job.commentItems
          });
          newJob = object.addDefaults(newJob, {
            hidden: false,
            new: false
          });
        }
        obj[job.id] = newJob;
        return obj;
      }, {});
      return object.merge(state, newState);
    },
    [actions.batchRemoveJobs]: (state, action) => {
      const jobIds = action.payload.map(job => job.id);
      return object.remove(state, jobIds);
    },
    [actions.showNewJobs]: (state, action) => {
      return object.merge(
        state,
        action.payload.reduce((obj, id) => {
          obj[id] = object.merge(state[id], { hidden: false });
          return obj;
        }, {})
      );
    },
    [actions.clearNewJobs]: (state, action) => {
      return object.merge(
        state,
        action.payload.reduce((obj, id) => {
          obj[id] = object.merge(state[id], { new: false });
          return obj;
        }, {})
      );
    },
    [actions.downloadMediaCustomFiledFileProgress]: (state, action) => {
      const { joborrouteid, fieldid } = action.payload;
      return collection.setIn(
        state,
        ["progress", joborrouteid, fieldid],
        action.payload.progress
      );
    },
    [actions.uploadMediaCustomFiledFileProgress]: (state, action) => {
      const { joborrouteid, fieldid } = action.payload;
      return collection.setIn(
        state,
        ["uploadprogress", joborrouteid, fieldid],
        action.payload.progress
      );
    },
    [actions.requestJob.init]: (state, action) => {
      const jobId = action.payload;
      const { originalJobOnly } = action.meta || {};
      return originalJobOnly
        ? collection.setIn(state, [jobId, "originalJobOnly"], true)
        : state;
    },
    [actions.requestJob.resolve]: (state, action) => {
      const jobId = action.payload;
      return collection.updateIn(state, [jobId], prevValue =>
        object.remove(prevValue, "originalJobOnly")
      );
    },
    [actions.requestJob.reject]: (state, action) => {
      const { jobId } = action.meta;
      return collection.updateIn(state, [jobId], prevValue =>
        object.remove(prevValue, "originalJobOnly")
      );
    },
    [actions.startJob.init]: (state, action) => {
      return collection.mergeIn(state, [action.payload], { status: 1 });
    },
    [actions.pauseJob.init]: (state, action) => {
      return collection.mergeIn(state, [action.payload], { status: 0 });
    },
    [actions.finishJob.init]: (state, action) => {
      return collection.mergeIn(state, [action.payload.id], {
        status: 2,
        description: action.payload.description
      });
    },
    [actions.hideJob]: (state, action) => {
      return collection.mergeIn(state, [action.payload], { hidden: true });
    },
    [actions.saveCustomField.init]: (state, action) => {
      const { jobId, customFieldId, customFieldValue } = action.payload;
      return collection.setIn(
        state,
        [jobId, "customFields", customFieldId],
        customFieldValue
      );
    },
    [actions.downloadMediaCustomFiledFile.resolve]: (state, action) => {
      const { joborrouteid, fieldid } = action.payload;
      return collection.setIn(
        state,
        ["customFieldsFiles", joborrouteid, fieldid],
        action.payload.filePath
      );
    },
    [actions.downloadMediaCustomFiledFile.reject]: (state, action) => {
      const { joborrouteid, fieldid, error } = action.payload;
      return collection.setIn(
        state,
        ["customFieldsFiles", joborrouteid, fieldid],
        { error: error }
      );
    },
    [actions.downloadMediaCustomFiledFile.init]: (state, action) => {
      const { jobId, fieldid } = action.payload;
      var obj = state;

      var jobc = collection.getIn(state, ["customFieldsFiles", jobId]);
      if (jobc === undefined) {
        obj = collection.setIn(obj, ["customFieldsFiles", jobId], null);
      }
      var fieldc = collection.getIn(state, [
        "customFieldsFiles",
        jobId,
        fieldid
      ]);
      if (fieldc === undefined) {
        obj = collection.setIn(
          obj,
          ["customFieldsFiles", jobId, fieldid],
          null
        );
      }
      return obj;
    },
    [actions.downloadMediaCustomFiledThumbnails.resolve]: (state, action) => {
      const { joborrouteid, fieldid } = action.payload;
      return collection.setIn(
        state,
        ["customFieldsThumbnails", joborrouteid, fieldid],
        action.payload.filePath
      );
    },
    [actions.downloadMediaCustomFiledThumbnails.reject]: (state, action) => {
      const { joborrouteid, fieldid, error } = action.payload;
      return collection.setIn(
        state,
        ["customFieldsThumbnails", joborrouteid, fieldid],
        { error: error }
      );
    },
    [actions.downloadMediaCustomFiledThumbnails.init]: (state, action) => {
      return collection.setIn(state, ["customFieldsThumbnails"], null);
    },
    [actions.uploadMediaCustomFiledFile.resolve]: (state, action) => {
      const { joborrouteid, fieldid } = action.payload;
      return collection.setIn(
        state,
        ["customFieldsUploadProgress", joborrouteid, fieldid],
        100
      );
    },
    [actions.uploadMediaCustomFiledFile.reject]: (state, action) => {
      const { joborrouteid, fieldid, error } = action.payload;
      return collection.setIn(
        state,
        ["customFieldsUploadProgress", joborrouteid, fieldid],
        { error: error }
      );
    },
    [actions.uploadMediaCustomFiledFile.init]: (state, action) => {
      return collection.setIn(
        state,
        ["customFieldsUploadProgress"],
        state["customFieldsUploadProgress"]
      );
    }
  }
);

const getLocation = location => {
  if (location && location.position) {
    return {
      lat: location.position.latitude,
      lng: location.position.longitude,
      address: location.address
    };
  }
  return null;
};

const getCustomFields = customFieldsStr => {
  const customFieldsArr = customFieldsStr ? JSON.parse(customFieldsStr) : [];
  return customFieldsArr.reduce((obj, field) => {
    var metaSeparatorIndex = field.Value ? field.Value.indexOf("|") : -1;
    obj[field.Key] =
      metaSeparatorIndex >= 0
        ? field.Value.substring(0, metaSeparatorIndex)
        : field.Value;
    return obj;
  }, {});
};

const byDateReducer = createReducer(
  {},
  {
    [actions.batchAddJobs]: (state, action, byId) => {
      const newState = action.payload.reduce(
        (obj, job) => {
          const date = moment(
            job.scheduledTime || job.completedTime || undefined
          ).format("YYYYMMDD");
          const prevDate = byId[job.id]
            ? byId[job.id].date.format("YYYYMMDD")
            : null;
          if (prevDate !== null && date !== prevDate) {
            if (!obj.removeJobs[prevDate]) {
              obj.removeJobs[prevDate] = [];
            }
            obj.removeJobs[prevDate].push(job.id);
          }
          if (date !== null) {
            if (!obj.addJobs[date]) {
              obj.addJobs[date] = {};
            }
            obj.addJobs[date][job.id] = true;
          }
          return obj;
        },
        { addJobs: {}, removeJobs: {} }
      );
      Object.entries(newState.addJobs).forEach(([date, jobIDs]) => {
        state = collection.mergeIn(state, [date], jobIDs);
      });
      Object.entries(newState.removeJobs).forEach(([date, jobIDs]) => {
        state = collection.updateIn(state, [date], prevValue =>
          object.remove(prevValue, jobIDs)
        );
      });
      return state;
    },
    [actions.batchRemoveJobs]: (state, action) => {
      const removeJobs = action.payload.reduce((obj, job) => {
        const date = job.date.format("YYYYMMDD");
        if (date !== null) {
          if (!obj[date]) {
            obj[date] = [];
          }
          obj[date].push(job.id);
        }
        return obj;
      }, {});
      Object.entries(removeJobs).forEach(([date, jobIDs]) => {
        state = collection.updateIn(state, [date], prevValue =>
          object.remove(prevValue, jobIDs)
        );
      });
      return state;
    }
  }
);

const isLoadingReducer = createReducer(
  {},
  {
    [actions.requestJob.init]: (state, action) => {
      const jobId = action.payload;
      return object.set(state, jobId, true);
    },
    [actions.requestJob.resolve]: (state, action) => {
      const jobId = action.payload;
      return object.set(state, jobId, false);
    },
    [actions.jobViewWillUnmount]: (state, action) => {
      const jobId = action.payload;
      return object.remove(state, jobId);
    }
  }
);

export default (state = {}, action) => {
  const byDate = byDateReducer(state.byDate, action, state.byId || {});
  const byId = byIdReducer(state.byId, action);
  const isLoading = isLoadingReducer(state.isLoading, action);
  return {
    byId,
    byDate,
    isLoading
  };
};
