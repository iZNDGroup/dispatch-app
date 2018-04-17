export const getAll = state => state.jobs.byId;

export const getById = (state, id) => state.jobs.byId[id];

export const getByDate = state => state.jobs.byDate;

export const isLoading = (state, id) =>
  !state.jobs.isLoading.hasOwnProperty(id) || !!state.jobs.isLoading[id];
