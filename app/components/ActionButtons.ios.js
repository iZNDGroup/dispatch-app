import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import globalStyles from "../styles/global";

export default class ActionButtons extends Component {
  render() {
    const status = this.props.status;
    const disableStart = [1, 2].includes(status);
    const disablePause = [0, 2].includes(status);
    const disableRoute = [1, 2].includes(status);
    const disableFinish = [0, 2].includes(status);

    return (
      <View style={styles.container}>
        <View style={[styles.action, disableStart && styles.disabled]}>
          <TouchableOpacity
            style={[styles.circle, styles.orange]}
            onPress={this.props.onStart}
            disabled={disableStart}
          >
            <Icon name="md-play" style={styles.icon} />
          </TouchableOpacity>
          <Text>Start</Text>
        </View>
        <View style={[styles.action, disableRoute && styles.disabled]}>
          <TouchableOpacity
            style={[styles.circle, styles.orange]}
            onPress={this.props.onRoute}
            disabled={disableRoute}
          >
            <Icon name="md-compass" style={styles.icon} />
          </TouchableOpacity>
          <Text>Route</Text>
        </View>
        <View style={[styles.action, disablePause && styles.disabled]}>
          <TouchableOpacity
            style={[styles.circle, styles.orange]}
            onPress={this.props.onPause}
            disabled={disablePause}
          >
            <Icon name="md-pause" style={styles.icon} />
          </TouchableOpacity>
          <Text>Pause</Text>
        </View>
        <View style={[styles.action, disableFinish && styles.disabled]}>
          <TouchableOpacity
            style={[styles.circle, styles.green]}
            onPress={this.props.onFinish}
            disabled={disableFinish}
          >
            <Icon name="md-checkbox-outline" style={styles.icon} />
          </TouchableOpacity>
          <Text>Finish</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: globalStyles.space * 3,
    paddingTop: globalStyles.space
  },
  action: {
    flex: 1,
    alignItems: "center"
  },
  circle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: globalStyles.space
  },
  green: {
    backgroundColor: globalStyles.green
  },
  orange: {
    backgroundColor: globalStyles.orange
  },
  icon: {
    color: "#FFFFFF",
    fontSize: globalStyles.iconSize * 0.8,
    height: globalStyles.iconSize * 0.8
  },
  disabled: {
    opacity: globalStyles.disabled
  }
});
