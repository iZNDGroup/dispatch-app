export const defaultAction = "defaultAction";
export const INIT = "init";
export const RESOLVE = "resolve";
export const REJECT = "reject";

export const createAction = (type, payloadFn) => {
  if (!payloadFn) {
    payloadFn = payload => payload;
  }
  const actionFn = (payload, meta) => {
    const action = { type };
    if (typeof payload !== "undefined" && !(payload instanceof Error)) {
      action.payload = payloadFn(payload);
    }
    if (meta) {
      action.meta = meta;
    }
    if (payload instanceof Error) {
      action.payload = payload;
      action.error = true;
    }
    return action;
  };
  actionFn.type = type;
  actionFn.toString = () => type;
  return actionFn;
};

export const createReducer = (initialState, handlers) => {
  return (state = initialState, action, ...args) => {
    if (handlers[action.type]) {
      return handlers[action.type](state, action, ...args);
    } else if (handlers[defaultAction]) {
      return handlers[defaultAction](state, action, ...args);
    } else {
      return state;
    }
  };
};

export const createOptimisticAction = (type, payloadFn) => {
  return {
    init: createAction(`${type}/${INIT}`, payloadFn),
    resolve: createAction(`${type}/${RESOLVE}`, payloadFn),
    reject: createAction(`${type}/${REJECT}`, payloadFn)
  };
};

export const createOptimisticReducer = (initialState, handlers) => {
  const reducer = createReducer(initialState, handlers);
  return (state = initialState, action) => {
    if (skipOptimistic(action)) {
      return state;
    }
    return reducer(state, action);
  };
};

const skipOptimistic = action => action.meta && action.meta.skipOptimistic;
