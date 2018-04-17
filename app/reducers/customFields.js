import { createReducer } from "../util/redux";
import { object } from "../util/immutable";
import * as actions from "../actions";

export default createReducer(
  { job: {}, route: {} },
  {
    [actions.requestCustomFields.resolve]: (state, action) => {
      const { namespace, customFields } = action.payload;
      return object.set(
        state,
        namespace,
        customFields.reduce((obj, field) => {
          obj[field.id] = object.merge(field, {
            defaultValue:
              field.cfType === "List"
                ? JSON.parse(field.defaultValue)
                : field.defaultValue
          });
          return obj;
        }, {})
      );
    }
  }
);
