import React, { Component } from "react";
import { StyleSheet, Text, View, Picker } from "react-native";
import customFieldStyles from "../styles/customField";
import globalStyles from "../styles/global";

export default class CustomFieldList extends Component {
  render() {
    const { value } = this.props;
    return (
      <View>
        <Text style={customFieldStyles.title}>{this.props.label}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={[styles.picker]}
            selectedValue={value}
            onValueChange={value => {
              this.props.onSave(value);
            }}
          >
            {this.props.options.map(({ label, value }) => (
              <Picker.Item label={label} value={value} key={value} />
            ))}
          </Picker>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pickerContainer: {
    marginHorizontal: 4,
    marginBottom: globalStyles.space,
    borderBottomColor: globalStyles.lineColor,
    borderBottomWidth: 1
  },
  picker: {
    height: 36
  }
});
