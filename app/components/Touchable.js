import React, { Component } from "react";
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from "react-native";

export default class Touchable extends Component {
  render() {
    let Component = null;
    if (Platform.OS === "ios") {
      Component = TouchableOpacity;
    } else {
      Component = TouchableNativeFeedback;
    }
    return <Component {...this.props}>{this.props.children}</Component>;
  }
}
