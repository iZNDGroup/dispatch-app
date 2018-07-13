import React from "react";
import { Text, View, Button, TouchableHighlight } from "react-native";
import { localize } from "../util/localize";
import customFieldStyles from "../styles/customField";

export default class CustomFieldPdfCard extends React.Component {
  componentDidCatch(error, info) {
    console.debug(error);
    console.debug(info);
  }

  render() {
    let {
      label,
      value,
      cfNamespace,
      uploadprogress,
      uploadNewContent,
      onPress
    } = this.props;

    return (
      <View style={customFieldStyles.mediaFieldContainer}>
        <TouchableHighlight
          onPress={onPress}
          style={customFieldStyles.mediaFieldTitle}
        >
          <Text style={customFieldStyles.mediaFieldTitleText}>{label}</Text>
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
            <Text style={{ textAlign: "center" }}>
              {localize("Tap here to open")} {value}
            </Text>
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
