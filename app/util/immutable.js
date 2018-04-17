import {
  addLast,
  insert,
  replaceAt,
  removeAt,
  getIn,
  setIn,
  updateIn,
  mergeIn,
  set,
  merge,
  addDefaults,
  omit
} from "timm";

export const array = {
  add: (arr, item) => {
    if (!arr) {
      arr = [];
    }
    return addLast(arr, item);
  },
  insert: (arr, i, item) => {
    if (!arr) {
      arr = [];
    }
    return insert(arr, i, item);
  },
  replaceAt: (arr, i, item) => {
    if (!arr) {
      arr = [];
    }
    return replaceAt(arr, i, item);
  },
  replace: (arr, callback, item, addIfNotExist = false) => {
    if (!arr) {
      arr = [];
    }
    const i = arr.findIndex(callback);
    if (i === -1) {
      if (addIfNotExist) {
        return addLast(arr, item);
      } else {
        return arr;
      }
    }
    return replaceAt(arr, i, item);
  },
  removeAt: (arr, i) => {
    if (!arr) {
      return [];
    }
    return removeAt(arr, i);
  },
  remove: (arr, callback) => {
    if (!arr) {
      return [];
    }
    const i = arr.findIndex(callback);
    return removeAt(arr, i);
  },
  copy: arr => {
    if (!arr) {
      arr = [];
    }
    return arr.slice();
  },
  replaceAll: (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return arr2;
    }
    for (let i = arr1.length; i--; ) {
      if (arr1[i] !== arr2[i]) {
        return arr2;
      }
    }
    return arr1;
  }
};

export const collection = {
  getIn: (obj, path) => {
    return getIn(obj, path);
  },
  setIn: (obj, path, val) => {
    return setIn(obj, path, val);
  },
  updateIn: (obj, path, callback) => {
    return updateIn(obj, path, callback);
  },
  mergeIn: (obj, path, item) => {
    return mergeIn(obj, path, item);
  }
};

export const object = {
  set: (obj, key, val) => {
    return set(obj, key, val);
  },
  merge: (obj, item) => {
    return merge(obj, item);
  },
  addDefaults: (obj, defaults) => {
    return addDefaults(obj, defaults);
  },
  remove: (obj, attrs) => {
    if (!obj) {
      return obj;
    }
    return omit(obj, attrs);
  },
  copy: obj => {
    return merge({}, obj);
  }
};
