import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import globalStyles from "../styles/global";

export default class SignatureActionButtons extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.action}>
          <TouchableOpacity
            style={[styles.circle, styles.red]}
            onPress={this.props.onClear}
            disabled={false}
          >
            <Icon name="md-document" style={styles.icon} />
          </TouchableOpacity>
          <Text>Clear</Text>
        </View>
        <View style={styles.action}>
          <TouchableOpacity
            style={[styles.circle, styles.green]}
            onPress={this.props.onSave}
            disabled={false}
          >
            <Icon name="ios-checkmark" style={styles.icon} />
          </TouchableOpacity>
          <Text>Save</Text>
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
  red: {
    backgroundColor: globalStyles.red
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
