import { createReducer } from "../util/redux";
import { object } from "../util/immutable";
import * as actions from "../actions";

export default createReducer(
  {},
  {
    [actions.login.init]: (state, action) => {
      return object.set(state, "isLoading", true);
    },
    [actions.login.resolve]: (state, action) => {
      state = object.set(state, "isLoading", false);
      state = object.set(state, "loginContext", action.payload);
      return state;
    },
    [actions.login.reject]: (state, action) => {
      return object.set(state, "isLoading", false);
    },
    [actions.logout.resolve]: (state, action) => {
      return {};
    }
  }
);
