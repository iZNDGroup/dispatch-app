import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import globalStyles from "../styles/global";

export default class Icon extends Component {
  render() {
    return (
      <View style={[styles.iconContainer, this.props.style]}>
        <Ionicons
          name={this.props.icon}
          style={[styles.icon, this.props.color && { color: this.props.color }]}
        />
        {this.props.text && (
          <Text style={[styles.iconText, { color: this.props.color }]}>
            {this.props.text}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    fontSize: globalStyles.iconSize
  },
  iconText: {
    fontSize: globalStyles.smallestTextSize
  },
  iconContainer: {
    minWidth: 40,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center"
  }
});
