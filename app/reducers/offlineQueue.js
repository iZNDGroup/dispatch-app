import { createReducer } from "../util/redux";
import { array } from "../util/immutable";
import { queue, resetQueue } from "../actions";

export default createReducer([], {
  [queue]: (state, action) => {
    return array.add(state, action.payload);
  },
  [resetQueue]: (state, action) => {
    return [];
  }
});
