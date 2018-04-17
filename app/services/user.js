import { AsyncStorage } from "react-native";
import Cookie from "react-native-cookie";
import RpcClient from "./client/RpcClient";

const asyncStorageKey = "userData";

export const login = async (baseUrl, username, password, autoLogin) => {
  try {
    if (!autoLogin) {
      await Cookie.clear();
    }
    const loginContext = await RpcClient.login(baseUrl, username, password);
    await setUserData({ baseUrl, username, password });
    return loginContext;
  } catch (err) {
    throw err;
  }
};

export const logout = async () => {
  try {
    await RpcClient.logout();
    await removeUserData();
  } catch (err) {
    throw err;
  }
};

export const getUserData = async () => {
  try {
    let value = await AsyncStorage.getItem(asyncStorageKey);
    value = JSON.parse(value);
    return value;
  } catch (err) {
    console.debug("error", err);
    return null;
  }
};

const setUserData = async value => {
  try {
    value = JSON.stringify(value);
    await AsyncStorage.setItem(asyncStorageKey, value);
  } catch (err) {
    console.debug("error", err);
  }
};

const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem(asyncStorageKey);
  } catch (err) {
    console.debug("error", err);
  }
};
