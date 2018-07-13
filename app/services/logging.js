import moment from "moment";
import { AsyncStorage, Platform } from "react-native";
import deviceInfo from "react-native-device-info";
import fs from "react-native-fs";

let enableLogging = false;

const asyncStorageKey = "logging";

const basePath = Platform.select({
  android: fs.ExternalDirectoryPath,
  ios: fs.DocumentDirectoryPath
});
const filePath = `${basePath}/log.txt`;

// Store the enableLogging flag in memory to avoid reading from storage on every appendLog call
async function initialize() {
  enableLogging = await isLoggingEnabled();
}
initialize();

export async function isLoggingEnabled() {
  try {
    const value = await AsyncStorage.getItem(asyncStorageKey);
    return JSON.parse(value);
  } catch (err) {
    console.debug("Failed to read from logging storage", err);
    return false;
  }
}

export async function setLoggingEnabled(value) {
  try {
    enableLogging = value;
    await AsyncStorage.setItem(asyncStorageKey, JSON.stringify(value));
    if (value) {
      appendLog("deviceInfo", {
        systemName: deviceInfo.getSystemName(),
        systemVersion: deviceInfo.getSystemVersion(),
        appVersion: deviceInfo.getVersion(),
        buildNumber: deviceInfo.getBuildNumber()
      });
    } else {
      unlinkLog();
    }
  } catch (err) {
    console.debug("Failed to write to logging storage", err);
  }
}

export function getLogFilePath() {
  return filePath;
}

export async function appendLog(...messages) {
  if (enableLogging) {
    try {
      const dateTime = moment().format();
      const formattedMessage = messages
        .map(message => {
          try {
            return JSON.stringify(message);
          } catch (err) {
            return "[Invalid]";
          }
        })
        .join(" ");
      const contents = `${dateTime} - ${formattedMessage}\r\n`;
      await fs.appendFile(filePath, contents, "utf8");
    } catch (err) {
      console.debug("Failed to write log", err);
    }
  }
}

// async function readLog() {
//   try {
//     const contents = await fs.readFile(filePath, "utf8");
//     return contents;
//   } catch (err) {
//     console.debug("Failed to read log", err);
//     return null;
//   }
// }

async function unlinkLog() {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.debug("Failed to unlink log", err);
  }
}
