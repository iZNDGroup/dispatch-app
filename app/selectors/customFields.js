export const getCustomFields = (state, namespace) =>
  state.customFields[namespace];

export const getJobCustomFields = state => getCustomFields(state, "job");

export const getRouteCustomFields = state => getCustomFields(state, "route");
