import PropTypes from "prop-types";
import React from "react";
import { Platform } from "react-native";
import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
import globalStyles from "../styles/global";
import NavigationBar from "./NavigationBar";
import PhotoView from "react-native-photo-view";
import * as actions from "../actions";
import customFieldStyles from "../styles/customField";

class CustomFieldPhotoView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props
    };
  }

  componentDidMount() {
    if (
      this.props.imgurl === null ||
      this.props.imgurl === undefined ||
      this.props.imgurl.trim() === ""
    ) {
      var payload = {
        fieldid: this.props.id,
        jobOrRouteId: this.props.jobOrRouteId.toString(),
        filename: this.props.value,
        cfNamespace: this.props.cfNamespace
      };

      this.props.downloadMediaCustomFieldFile(payload);
    }
  }

  render() {
    var url = this.props.imgurl;
    if (Platform.OS === "android") {
      url = "file://" + url;
    } else {
      url = "file://" + url;
    }

    return (
      <View style={styles.container}>
        <NavigationBar
          title="Photo view"
          leftIcon="md-arrow-back"
          leftAction={this._goBack}
        />
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            {!this.props.imgurl && (
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: "#000000"
                }}
              >
                <Text style={customFieldStyles.modalLoadingText}>
                  Loading {this.props.progress}%
                </Text>
              </View>
            )}
            {!!this.props.imgurl && (
              <PhotoView
                source={{ uri: url }}
                minimumZoomScale={1}
                maximumZoomScale={5}
                androidScaleType="fitCenter"
                onLoad={() => console.debug("image loaded")}
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: "#000000"
                }}
              />
            )}
          </View>
        </View>
      </View>
    );
  }

  _goBack = () => {
    this.props.navigator.pop();
    this.context.tabBar.toggle(true);
  };
}

CustomFieldPhotoView.contextTypes = {
  tabBar: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.primaryBackgroundColor
  }
});

const mapStateToProps = (initialState, initialProps) => {
  let stateToProps;
  if (!initialProps.cfNamespace) {
    return {};
  }
  if (initialProps.cfNamespace === "job") {
    stateToProps = {
      imgurl:
        initialState.jobs.byId.customFieldsFiles &&
        initialState.jobs.byId.customFieldsFiles[initialProps.jobOrRouteId]
          ? initialState.jobs.byId.customFieldsFiles[initialProps.jobOrRouteId][
              initialProps.fieldid
            ]
          : null,
      progress:
        initialState.jobs.byId.progress &&
        initialState.jobs.byId.progress[initialProps.jobOrRouteId]
          ? parseFloat(
              initialState.jobs.byId.progress[initialProps.jobOrRouteId][
                initialProps.fieldid
              ]
            ).toFixed(1)
          : null
    };
  } else {
    stateToProps = {
      imgurl:
        initialState.jobs.byId.customFieldsFiles &&
        initialState.jobs.byId.customFieldsFiles[initialProps.jobOrRouteId]
          ? initialState.jobs.byId.customFieldsFiles[initialProps.jobOrRouteId][
              initialProps.fieldid
            ]
          : null,
      progress:
        initialState.jobs.byId.progress &&
        initialState.jobs.byId.progress[initialProps.jobOrRouteId]
          ? parseFloat(
              initialState.jobs.byId.progress[initialProps.jobOrRouteId][
                initialProps.fieldid
              ]
            ).toFixed(1)
          : null
    };
  }
  return stateToProps;
};

const mapDispatchToProps = {
  downloadMediaCustomFieldFile: actions.downloadMediaCustomFieldFile.init
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(CustomFieldPhotoView);
