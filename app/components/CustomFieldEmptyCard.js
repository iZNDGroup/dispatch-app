import React from "react";
import { Text, View, Button, TouchableHighlight } from "react-native";
import { localize } from "../util/localize";
import customFieldStyles from "../styles/customField";

export default class CustomFieldEmptyCard extends React.Component {
  componentDidCatch(error, info) {
    console.debug(error);
    console.debug(info);
  }

  render() {
    const { label, cfNamespace, uploadprogress, uploadNewContent } = this.props;
    return (
      <View>
        <TouchableHighlight
          onPress={uploadNewContent}
          style={customFieldStyles.mediaFieldTitle}
        >
          <Text style={customFieldStyles.mediaFieldTitleText}>
            {uploadprogress !== null &&
            uploadprogress !== undefined &&
            uploadprogress !== "NaN"
              ? localize("Loading...") + " " + uploadprogress + " %"
              : label}
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={uploadNewContent}>
          <View
            style={{
              width: "100%",
              height: 200,
              justifyContent: "center",
              flex: 1
            }}
          >
            <Text style={{ textAlign: "center" }}>
              {localize("No media available")}
            </Text>
          </View>
        </TouchableHighlight>
        {cfNamespace === "job" && (
          <Button
            title={
              uploadprogress && uploadprogress !== "NaN"
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
