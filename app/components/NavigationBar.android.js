import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import TouchableIcon from "./TouchableIcon";
import Touchable from "./Touchable";
import Icon from "./Icon";
import globalStyles from "../styles/global";

export default class NavigationBar extends Component {
  _renderBar() {
    let icon = null;
    if (this.props.leftIcon && this.props.leftAction) {
      icon = (
        <TouchableIcon
          action={this.props.leftAction}
          icon={this.props.leftIcon}
          color={globalStyles.navigationBarActionColor}
        />
      );
    } else if (this.props.leftIcon) {
      icon = (
        <Icon
          icon={this.props.leftIcon}
          color={globalStyles.navigationBarActionColor}
        />
      );
    }

    return (
      <View style={styles.navigationBar}>
        {icon}
        <Text style={styles.title} numberOfLines={1}>
          {this.props.title}
        </Text>
      </View>
    );
  }

  render() {
    if (this.props.barAction) {
      return (
        <Touchable onPress={this.props.barAction}>
          {this._renderBar()}
        </Touchable>
      );
    } else {
      if (this.props.leftAction) {
        return (
          <Touchable onPress={this.props.leftAction}>
            {this._renderBar()}
          </Touchable>
        );
      } else {
        return this._renderBar();
      }
    }
  }
}

const styles = StyleSheet.create({
  navigationBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: globalStyles.navigationBarBackgroundColor,
    elevation: 5
  },
  title: {
    color: globalStyles.navigationBarTextColor,
    fontSize: globalStyles.biggerTextSize,
    flex: 1
  }
});
