import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { StyleSheet, View } from "react-native";
import globalStyles from "../styles/global";
import { localize } from "../util/localize";
import NavigationBar from "./NavigationBar";
import SignatureActionButtons from "./SignatureActionButtons";
import { SketchCanvas } from "@terrylinla/react-native-sketch-canvas";

class Signature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signid: String(Math.ceil(Math.random() * 100000000)),
      thickness: 5
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={localize("Signature")}
          leftIcon="md-arrow-back"
          leftAction={this._goBack}
        />
        <SignatureActionButtons
          onSave={() => {
            this.canvas.getBase64("png", false, (err, result) => {
              this._onSaveEvent(err, result);
            });
          }}
          onClear={() => {
            this.canvas.clear();
          }}
        />
        <View style={{ flex: 1, flexDirection: "row" }} {...this.props}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <SketchCanvas
              ref={ref => (this.canvas = ref)}
              style={{ flex: 1 }}
              strokeColor={this.state.color}
              strokeWidth={this.state.thickness}
            />
          </View>
        </View>
      </View>
    );
  }

  _goBack = () => {
    this.props.navigator.pop();
    this.context.tabBar.toggle(true);
  };

  _onSaveEvent = (err, result) => {
    let params = {
      uri: "base64",
      fileName: "signature_" + this.state.signid + ".png",
      data: result
    };
    this.props.onSave(params);
    this.props.navigator.pop();
  };
}

Signature.defaultProps = {
  showActions: true
};

Signature.contextTypes = {
  tabBar: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.primaryBackgroundColor
  },
  strokeColorButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15
  },
  strokeWidthButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#39579A"
  },
  functionButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    height: 30,
    width: 60,
    backgroundColor: "#39579A",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
  }
});

const mapStateToProps = (initialState, initialProps) => {
  let stateToProps = {};
  return stateToProps;
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(Signature);
