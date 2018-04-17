import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SketchCanvas } from "@terrylinla/react-native-sketch-canvas";

export default class Signature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signid: String(Math.ceil(Math.random() * 100000000))
    };
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "row" }} {...this.props}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.functionButton}
                onPress={() => {
                  this.setState({ thickness: 10 });
                }}
              >
                <Text style={{ color: "white" }}>Thick</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.functionButton}
                onPress={() => {
                  this.setState({ thickness: 5 });
                }}
              >
                <Text style={{ color: "white" }}>Thin</Text>
              </TouchableOpacity>
            </View>
          </View>
          <SketchCanvas
            ref={ref => (this.canvas = ref)}
            style={{ flex: 1 }}
            strokeColor={this.state.color}
            strokeWidth={this.state.thickness}
            onStrokeStart={() => {
              console.debug("start");
            }}
            onStrokeChanged={() => {
              console.debug("changed");
            }}
            onStrokeEnd={() => {
              console.debug("end");
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={[
                styles.functionButton,
                { backgroundColor: "black", width: 90 }
              ]}
              onPress={() => {
                this.canvas.getBase64("png", false, (err, result) => {
                  this._onSaveEvent(err, result);
                });
              }}
            >
              <Text style={{ color: "white" }}>Finish</Text>
            </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
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
