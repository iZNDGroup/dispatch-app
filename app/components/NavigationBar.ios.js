import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Touchable from "./Touchable";
import globalStyles from "../styles/global";

export default class NavigationBar extends Component {
  _renderSide(icon, text, action, rightAligned = false) {
    let iconComponent = null;
    let textComponent = null;
    let Wrapper = null;
    if (icon) {
      iconComponent = (
        <Icon name={this.props.leftIcon} style={styles.actionIcon} />
      );
    }
    if (text) {
      textComponent = <Text style={styles.actionText}>{text}</Text>;
    }
    if (action) {
      Wrapper = Touchable;
    } else {
      Wrapper = View;
    }
    return (
      <Wrapper
        style={[styles.action, rightAligned && styles.actionRightAligned]}
        onPress={action}
      >
        {iconComponent}
        {textComponent}
      </Wrapper>
    );
  }

  _renderCenter(title, subtitle) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerTitle}>{title}</Text>
        {subtitle && <Text style={styles.centerSubtitle}>{subtitle}</Text>}
      </View>
    );
  }

  _renderBar() {
    let leftComponent = this._renderSide(
      this.props.leftIcon,
      this.props.leftText,
      this.props.leftAction
    );
    let rightComponent = this._renderSide(
      this.props.rightIcon,
      this.props.rightText,
      this.props.rightAction,
      true
    );
    let centerComponent = this._renderCenter(
      this.props.title,
      this.props.subtitle
    );

    return (
      <View style={styles.navigationBar}>
        <View style={styles.topBar}>
          {leftComponent}
          {centerComponent}
          {rightComponent}
        </View>
        {this.props.extraBar && (
          <View style={styles.bottomBar}>{this.props.extraBar}</View>
        )}
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
    paddingTop: 20, // Due to statusbar is transparent
    backgroundColor: globalStyles.navigationBarBackgroundColor,
    borderColor: globalStyles.lineColor,
    borderBottomWidth: 1,
    zIndex: 1001
  },
  topBar: {
    height: 44,
    flexDirection: "row",
    alignItems: "center"
  },
  bottomBar: {
    alignItems: "center",
    paddingBottom: globalStyles.space
  },
  center: {
    flex: 2,
    alignItems: "center"
  },
  centerTitle: {
    color: globalStyles.navigationBarTextColor,
    fontSize: globalStyles.biggerTextSize,
    fontWeight: "600"
  },
  centerSubtitle: {
    color: globalStyles.navigationBarTextColor,
    fontSize: globalStyles.smallerTextSize
  },
  action: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  actionRightAligned: {
    justifyContent: "flex-end"
  },
  actionText: {
    fontSize: globalStyles.biggerTextSize,
    color: globalStyles.navigationBarActionColor
  },
  actionIcon: {
    fontSize: globalStyles.iconSize,
    height: globalStyles.iconSize,
    color: globalStyles.navigationBarActionColor,
    paddingHorizontal: globalStyles.space
  }
});
