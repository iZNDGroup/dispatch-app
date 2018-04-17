import { combineReducers } from "redux";
import { createReducer } from "../util/redux";
import { object } from "../util/immutable";
import * as actions from "../actions";

const byId = createReducer(
  {},
  {
    [actions.batchAddRoutes]: (state, action) => {
      const routes = action.payload.reduce((obj, route) => {
        obj[route.id] = {
          id: route.id,
          name: route.name,
          note: route.label,
          customFields: getCustomFields(route.customFields),
          isFull: route.hasOwnProperty("createdDate")
        };
        return obj;
      }, {});
      return object.merge(state, routes);
    },
    [actions.batchRemoveRoutes]: (state, action) => {
      const routeIds = action.payload;
      return object.remove(state, routeIds);
    }
  }
);

const getCustomFields = customFieldsStr => {
  const customFieldsArr = customFieldsStr ? JSON.parse(customFieldsStr) : [];
  return customFieldsArr.reduce((obj, field) => {
    obj[field.Key] = field.Value;
    return obj;
  }, {});
};

const isLoading = createReducer(
  {},
  {
    [actions.requestRoute.init]: (state, action) => {
      const routeId = action.payload;
      return object.set(state, routeId, true);
    },
    [actions.requestRoute.resolve]: (state, action) => {
      const routeId = action.payload;
      return object.remove(state, routeId);
    }
  }
);

export default combineReducers({
  byId,
  isLoading
});
