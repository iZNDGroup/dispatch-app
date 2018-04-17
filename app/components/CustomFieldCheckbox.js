import React, { Component } from "react";
import { StyleSheet, Text, View, Switch, Platform } from "react-native";
import customFieldStyles from "../styles/customField";
import globalStyles from "../styles/global";

export default class CheckboxFieldCheckbox extends Component {
  render() {
    const { value } = this.props;
    const checked = value === "checked";
    return (
      <View style={styles.container}>
        <Text style={customFieldStyles.title}>{this.props.label}</Text>
        <Switch
          style={styles.checkbox}
          value={checked}
          onTintColor={globalStyles.checkboxColor}
          onValueChange={value => {
            const checked = value ? "checked" : "unchecked";
            this.props.onSave(checked);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  checkbox: {
    ...Platform.select({
      ios: {
        marginRight: globalStyles.space
      }
    })
  }
});
