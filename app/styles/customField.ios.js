import { StyleSheet } from "react-native";
import globalStyles from "./global";

export default StyleSheet.create({
  title: {
    color: globalStyles.convertHex(globalStyles.primaryTextColor, 0.58),
    fontSize: globalStyles.smallestTextSize,
    paddingTop: 4
  },
  value: {
    color: globalStyles.primaryTextColor,
    fontSize: globalStyles.normalTextSize
  },
  modalLoadingText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "#ffffff",
    fontSize: 30
  },
  mediaFieldContainer: {
    position: "relative"
  },
  mediaFieldTitle: {
    position: "absolute",
    zIndex: 9,
    backgroundColor: "rgba(52, 52, 52, 0.4)",
    width: "100%"
  },
  mediaFieldTitleText: {
    color: "rgba(255, 255, 255, 1)",
    paddingHorizontal: 4,
    paddingTop: 4,
    fontSize: 22,
    fontWeight: "bold"
  },
  mediaUploadButton: {
    position: "absolute",
    zIndex: 9,
    backgroundColor: "rgba(52, 52, 52, 0.4)",
    width: "100%",
    bottom: 10
  }
});
