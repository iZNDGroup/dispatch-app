import { Platform, ToastAndroid, AlertIOS } from "react-native";
import DialogAndroid from "react-native-dialogs";

export const showToast = message => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    // TODO: Should we give any feedback on iOS?
  }
};

export const showAlert = title => {
  return new Promise((resolve, reject) => {
    if (Platform.OS === "ios") {
      AlertIOS.alert(title, null, [
        {
          text: "Cancel",
          onPress: () => {
            reject(new Error("Cancel"));
          },
          style: "cancel"
        },
        { text: "OK", onPress: resolve }
      ]);
    } else {
      const options = {
        title: title,
        positiveText: "OK",
        negativeText: "Cancel",
        onNegative: () => {
          reject(new Error("Cancel"));
        }
      };
      const dialog = new DialogAndroid();
      dialog.set(options);
      dialog.show();
    }
  });
};

export const showDialog = (title, hint) => {
  return new Promise((resolve, reject) => {
    if (Platform.OS === "ios") {
      AlertIOS.prompt(title, null, [
        {
          text: "Cancel",
          onPress: () => {
            reject(new Error("Cancel"));
          },
          style: "cancel"
        },
        { text: "OK", onPress: resolve }
      ]);
    } else {
      const options = {
        title: title,
        positiveText: "OK",
        negativeText: "Cancel",
        input: {
          hint: hint,
          callback: resolve
        },
        onNegative: () => {
          reject(new Error("Cancel"));
        }
      };
      const dialog = new DialogAndroid();
      dialog.set(options);
      dialog.show();
    }
  });
};

export const toggleTabbar = (event, tabBar) => {
  const currentOffset = event.nativeEvent.contentOffset.y;
  const prevOffset = this.prevOffset || 0;

  const scrollDiff = Math.abs(currentOffset - prevOffset);

  if (scrollDiff > 60) {
    tabBar.toggle(currentOffset < prevOffset);
    this.prevOffset = currentOffset;
  }
};
