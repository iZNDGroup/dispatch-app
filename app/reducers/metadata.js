import { createReducer } from "../util/redux";
import { collection, object } from "../util/immutable";
import moment from "moment";
import * as actions from "../actions";

export default createReducer(
  {},
  {
    [actions.batchAddMetadata]: (state, action) => {
      const newState = action.payload.reduce((obj, job) => {
        const date = moment(job.dateTime || undefined).format("YYYYMMDD");
        if (date !== null) {
          if (!obj[date]) {
            obj[date] = {};
          }
          obj[date][job.id] = true;
        }
        return obj;
      }, {});
      Object.entries(newState).forEach(([date, jobIDs]) => {
        state = collection.mergeIn(state, [date], jobIDs);
      });
      return state;
    },
    [actions.batchRemoveMetadata]: (state, action) => {
      const removeJobs = action.payload.reduce((obj, job) => {
        const date = moment(job.dateTime || undefined).format("YYYYMMDD");
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
