import { AsyncStorage, Platform } from "react-native";
import { updateFCMToken, removeFCMToken } from "./dispatch";
import { appendLog } from "./logging";

const asyncStorageKey = "fcmToken";

export const updateToken = async newToken => {
  const oldToken = await getToken();
  if (!newToken) {
    await removeFCMToken(oldToken);
    await removeToken();
  } else if (newToken !== oldToken) {
    if (oldToken) {
      await removeFCMToken(oldToken);
      await removeToken();
    }
    const deviceType = getDeviceType();
    await updateFCMToken(newToken, deviceType);
    await setToken(newToken);
  }
};

const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem(asyncStorageKey);
    return value;
  } catch (err) {
    console.debug("Failed to read from fcmToken storage", err);
    appendLog("Failed to read from fcmToken storage", err);
    return null;
  }
};

const setToken = async token => {
  try {
    await AsyncStorage.setItem(asyncStorageKey, token);
  } catch (err) {
    console.debug("Failed to write to fcmToken storage", err);
    appendLog("Failed to write to fcmToken storage", err);
  }
};

const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(asyncStorageKey);
  } catch (err) {
    console.debug("Failed to remove from fcmToken storage", err);
    appendLog("Failed to remove from fcmToken storage", err);
  }
};

const getDeviceType = () => {
  if (Platform.OS === "android") {
    return 1;
  } else if (Platform.OS === "ios") {
    return 2;
  } else {
    return 3;
  }
};
