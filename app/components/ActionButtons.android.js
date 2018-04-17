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
    const showRoute = status === 0;
    const showPause = status !== 0;

    return (
      <View style={styles.container}>
        <View style={[styles.action, disableStart && styles.disabled]}>
          <TouchableOpacity
            style={[
              styles.circle,
              styles.green,
              disableStart && styles.disabledCircle
            ]}
            onPress={this.props.onStart}
            disabled={disableStart}
          >
            <Icon name="md-play" style={styles.icon} />
          </TouchableOpacity>
          <Text>Start</Text>
        </View>
        {showRoute && (
          <View style={[styles.action, disableRoute && styles.disabled]}>
            <TouchableOpacity
              style={[
                styles.circle,
                styles.green,
                disableRoute && styles.disabledCircle
              ]}
              onPress={this.props.onRoute}
              disabled={disableRoute}
            >
              <Icon name="md-compass" style={styles.icon} />
            </TouchableOpacity>
            <Text>Start and Route</Text>
          </View>
        )}
        {showPause && (
          <View style={[styles.action, disablePause && styles.disabled]}>
            <TouchableOpacity
              style={[styles.circle, disablePause && styles.disabledCircle]}
              onPress={this.props.onPause}
              disabled={disablePause}
            >
              <Icon name="md-pause" style={styles.icon} />
            </TouchableOpacity>
            <Text>Pause</Text>
          </View>
        )}
        <View style={[styles.action, disableFinish && styles.disabled]}>
          <TouchableOpacity
            style={[styles.circle, disableFinish && styles.disabledCircle]}
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
    backgroundColor: "#ddd",
    padding: globalStyles.space * 2,
    elevation: 3
  },
  action: {
    flex: 1,
    alignItems: "center"
  },
  circle: {
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: globalStyles.space,
    elevation: 4,
    backgroundColor: globalStyles.secondaryColor
  },
  green: {
    backgroundColor: globalStyles.green
  },
  icon: {
    color: globalStyles.invertedTextColor,
    fontSize: globalStyles.iconSize
  },
  disabled: {
    opacity: globalStyles.disabled
  },
  disabledCircle: {
    elevation: 0
  }
});
