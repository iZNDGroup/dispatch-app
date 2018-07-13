import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
import globalStyles from "../styles/global";
import NavigationBar from "./NavigationBar";
import PdfView from "react-native-pdf";
import * as actions from "../actions";
import { localize } from "../util/localize";
import customFieldStyles from "../styles/customField";

class CustomFieldPdfView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props
    };
  }

  componentDidMount() {
    if (
      this.props.url === null ||
      this.props.url === undefined ||
      this.props.url.trim() === ""
    ) {
      var payload = {
        fieldid: this.props.fieldid,
        jobOrRouteId: this.props.jobOrRouteId.toString(),
        filename: this.props.filename,
        cfNamespace: this.props.cfNamespace
      };

      this.props.downloadMediaCustomFieldFile(payload);
    }
  }

  render() {
    var url = this.props.imgurl;
    if (url) {
      url = "file://" + url;
    }

    return (
      <View style={styles.container}>
        <NavigationBar
          title="Pdf viewer"
          leftIcon="md-arrow-back"
          leftAction={this._goBack}
        />
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            {!url && (
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: "#000000"
                }}
              >
                <Text style={customFieldStyles.modalLoadingText}>
                  {localize("Loading...")} {this.props.progress}%
                </Text>
              </View>
            )}
            {!!url && (
              <PdfView
                source={{ uri: url }}
                onLoadComplete={(numberOfPages, filePath) => {
                  console.log(`number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                  console.log(`current page: ${page}`);
                }}
                onError={error => {
                  console.log(error);
                }}
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

CustomFieldPdfView.contextTypes = {
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
})(CustomFieldPdfView);
