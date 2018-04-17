const navigators = {};

export const addNavigator = (id, navigator) => {
  navigators[id] = navigator;
};

export const removeNavigator = id => {
  delete navigators[id];
};

export const getNavigator = id => {
  return navigators[id];
};
