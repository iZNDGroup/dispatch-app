import React, { Component } from "react";
import { View } from "react-native";
import Touchable from "./Touchable";
import Icon from "./Icon";

export default class TouchableIcon extends Component {
  render() {
    return (
      <Touchable onPress={this.props.action}>
        <View>
          <Icon {...this.props} />
        </View>
      </Touchable>
    );
  }
}
