import React, { Component } from "react";
import { StyleSheet, Text, Animated, Dimensions, Platform } from "react-native";
import globalStyles from "../styles/global";

export default class NewJobsLabel extends Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.marginLeft = Dimensions.get("window").width / 2 - 50; // Center the label
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.quantity > 0) {
      this._show();
    } else {
      this.animatedValue.setValue(0);
    }
  }

  _show = () => {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 500
    }).start();
  };

  _hide = () => {
    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: 500
    }).start(() => {
      if (this.props.callback) {
        this.props.callback();
      }
    });
  };

  render() {
    const animation = this.animatedValue.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [-70, -10, 0]
    });
    const label =
      this.props.quantity > 1 ? this.props.quantity + " new jobs" : "New job";

    return (
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: animation }],
            marginLeft: this.marginLeft
          }
        ]}
      >
        <Text style={styles.label} onPress={this._hide}>
          {label}
        </Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 100,
    zIndex: 1000,
    alignItems: "center",
    backgroundColor: globalStyles.newJobsLabelBackgroundColor,
    borderRadius: globalStyles.space * 2,
    padding: globalStyles.space,
    ...Platform.select({
      ios: {
        top: globalStyles.space * 15,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowOffset: { height: 1, width: 1 }
      },
      android: {
        top: globalStyles.space * 2,
        elevation: 5
      }
    })
  },
  label: {
    color: globalStyles.newJobsLabelTextColor
  }
});
