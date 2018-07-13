export const getCustomFields = (state, namespace) =>
  state.customFields[namespace];

export const getJobCustomFields = state => getCustomFields(state, "job");

export const getRouteCustomFields = state => getCustomFields(state, "route");

export const getImgurl = (state, cfNamespace, jobOrRouteId, fieldid) => {
  return state.jobs.byId.customFieldsFiles &&
    state.jobs.byId.customFieldsFiles[jobOrRouteId]
    ? state.jobs.byId.customFieldsFiles[jobOrRouteId][fieldid]
    : undefined;
};
export const getThumbImgUrl = (state, cfNamespace, jobOrRouteId, fieldid) => {
  return state.jobs.byId.customFieldsThumbnails &&
    state.jobs.byId.customFieldsThumbnails[jobOrRouteId]
    ? state.jobs.byId.customFieldsThumbnails[jobOrRouteId][fieldid]
    : undefined;
};
export const getProgress = (state, cfNamespace, jobOrRouteId, fieldid) => {
  return state.jobs.byId.progress && state.jobs.byId.progress[jobOrRouteId]
    ? parseFloat(state.jobs.byId.progress[jobOrRouteId][fieldid]).toFixed(1)
    : null;
};
export const getUploadprogress = (
  state,
  cfNamespace,
  jobOrRouteId,
  fieldid
) => {
  return state.jobs.byId.uploadprogress &&
    state.jobs.byId.uploadprogress[jobOrRouteId] &&
    state.jobs.byId.uploadprogress[jobOrRouteId][fieldid]
    ? parseFloat(state.jobs.byId.uploadprogress[jobOrRouteId][fieldid]).toFixed(
        1
      )
    : null;
};
