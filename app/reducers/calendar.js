import moment from "moment";
import { createReducer } from "../util/redux";
import { object } from "../util/immutable";
import * as actions from "../actions";

export default createReducer(
  { today: null, selectedDate: null },
  {
    [actions.updateToday]: (state, action) => {
      const today = moment().startOf("day");
      if (moment(state.today).isSame(today, "d")) {
        return state;
      }
      return object.set(state, "today", today);
    },
    [actions.selectDate]: (state, action) => {
      if (moment(state.selectedDate).isSame(action.payload, "d")) {
        return state;
      }
      return object.set(state, "selectedDate", action.payload);
    }
  }
);
