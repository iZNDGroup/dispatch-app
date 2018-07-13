import React from "react";
import { Text, View, Button, TouchableHighlight } from "react-native";
import { localize } from "../util/localize";
import customFieldStyles from "../styles/customField";

export default class CustomFieldDownloadCard extends React.Component {
  render() {
    const {
      value,
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
          <View
            style={{
              width: "100%",
              height: 200,
              justifyContent: "center",
              flex: 1
            }}
          >
            <Text style={{ textAlign: "center" }}>{value}</Text>
          </View>
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
