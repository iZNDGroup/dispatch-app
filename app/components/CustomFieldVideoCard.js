import React from "react";
import { Text, View, Image, Button, TouchableHighlight } from "react-native";
import { localize } from "../util/localize";
import customFieldStyles from "../styles/customField";

export default class CustomFieldVideoCard extends React.Component {
  render() {
    const {
      label,
      cfNamespace,
      uploadprogress,
      progress,
      uploadNewContent,
      onPress
    } = this.props;
    return (
      <View>
        <TouchableHighlight
          onPress={onPress}
          style={customFieldStyles.mediaFieldTitle}
        >
          <Text style={customFieldStyles.mediaFieldTitleText}>
            {progress !== null && progress !== undefined && progress !== "NaN"
              ? localize("Loading...") + " " + progress + " %"
              : label}
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={onPress}>
          <Image
            source={require("../resources/player.png")}
            style={{ width: "100%", height: 200 }}
          />
        </TouchableHighlight>
        {cfNamespace === "job" && (
          <Button
            title={
              uploadprogress !== null &&
              uploadprogress !== undefined &&
              uploadprogress !== "NaN"
                ? localize("Uploading...") + " " + uploadprogress + " %"
                : localize("Take an action")
            }
            onPress={uploadNewContent}
            style={customFieldStyles.mediaUploadButton}
          />
        )}
      </View>
    );
  }
}
