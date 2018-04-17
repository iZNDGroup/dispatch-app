import { combineReducers } from "redux";
import * as actions from "../actions";
import offlineQueue from "./offlineQueue";
import ui from "./ui";
import user from "./user";
import calendar from "./calendar";
import jobs from "./jobs";
import routes from "./routes";
import metadata from "./metadata";
import customFields from "./customFields";

const appReducer = combineReducers({
  offlineQueue,
  ui,
  user,
  calendar,
  jobs,
  routes,
  metadata,
  customFields
});

const rootReducer = (state, action) => {
  if (action.type === actions.logout.resolve.type) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
