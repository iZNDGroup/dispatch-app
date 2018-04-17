export const getIsLoading = state => !!state.user.isLoading;

export const getUserId = state =>
  state.user.loginContext ? state.user.loginContext.userId : -1;

export const getApplicationId = state =>
  state.user.loginContext ? state.user.loginContext.applicationId : -1;

export const getIsLoggedIn = state => getUserId(state) > 0;
