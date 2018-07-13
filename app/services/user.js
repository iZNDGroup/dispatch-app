import { AsyncStorage } from "react-native";
import Cookie from "react-native-cookie";
import RpcClient from "./client/RpcClient";
import { appendLog } from "./logging";

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
    console.debug("Failed to read from userData storage", err);
    appendLog("Failed to read from userData storage", err);
    return null;
  }
};

const setUserData = async value => {
  try {
    value = JSON.stringify(value);
    await AsyncStorage.setItem(asyncStorageKey, value);
  } catch (err) {
    console.debug("Failed to write to userData storage", err);
    appendLog("Failed to write to userData storage", err);
  }
};

const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem(asyncStorageKey);
  } catch (err) {
    console.debug("Failed to remove from userData storage", err);
    appendLog("Failed to remove from userData storage", err);
  }
};
