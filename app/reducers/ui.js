import { combineReducers } from "redux";
import { defaultAction, createReducer } from "../util/redux";
import { array, object } from "../util/immutable";
import * as actions from "../actions";

const errors = createReducer([], {
  [actions.clearErrors]: (state, action) => {
    return [];
  },
  [defaultAction]: (state, action) => {
    if (action.error) {
      return array.add(state, action.payload.message);
    }
    return state;
  }
});

const isLoading = createReducer(true, {
  [actions.setIsLoading]: (state, action) => {
    return action.payload;
  },
  [actions.batchAddJobs]: (state, action) => {
    return false;
  }
});

const netInfo = createReducer(
  { isConnected: false, statusText: null },
  {
    [actions.online]: (state, action) => {
      return object.set(state, "isConnected", true);
    },
    [actions.offline]: (state, action) => {
      return object.set(state, "isConnected", false);
    },
    [actions.setNetInfo]: (state, action) => {
      return object.set(state, "statusText", action.payload);
    }
  }
);

const settings = createReducer(
  { hideFinished: false },
  {
    [actions.showAll]: (state, action) => {
      return object.set(state, "hideFinished", false);
    },
    [actions.showPending]: (state, action) => {
      return object.set(state, "hideFinished", true);
    }
  }
);

export default combineReducers({
  errors,
  isLoading,
  netInfo,
  settings
});
