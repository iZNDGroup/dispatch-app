export const getAll = state => state.routes.byId;

export const getById = (state, id) => state.routes.byId[id];

export const isLoading = (state, id) =>
  state.routes.isLoading.hasOwnProperty(id);
