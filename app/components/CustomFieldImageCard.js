import React from "react";
import {
  Text,
  View,
  Platform,
  Image,
  Button,
  TouchableHighlight
} from "react-native";
import { localize } from "../util/localize";
import customFieldStyles from "../styles/customField";

export default class CustomFieldImageCard extends React.Component {
  componentDidCatch(error, info) {
    console.debug(error);
    console.debug(info);
  }

  render() {
    const {
      thumbnailUrl,
      imgurl,
      label,
      cfNamespace,
      uploadprogress,
      uploadNewContent,
      onPress
    } = this.props;

    let thumb = thumbnailUrl;

    let iscontentType = thumbnailUrl
      ? thumbnailUrl.indexOf("content://") >= 0 ||
        thumbnailUrl.indexOf("file://") >= 0
      : false;

    if (Platform.OS === "android" && !iscontentType) {
      thumb = "file://" + thumbnailUrl;
    }

    if (imgurl === "base64") {
      thumb = undefined;
    }

    if (Platform.OS === "ios" && !thumbnailUrl) {
      thumb = undefined;
    }

    return (
      <View style={customFieldStyles.mediaFieldContainer}>
        <TouchableHighlight
          onPress={onPress}
          style={customFieldStyles.mediaFieldTitle}
        >
          <Text style={customFieldStyles.mediaFieldTitleText}>{label}</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={onPress}>
          <Image
            source={{ isStatic: false, uri: thumb }}
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
