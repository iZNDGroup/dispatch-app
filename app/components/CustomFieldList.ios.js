import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Picker,
  Modal,
  TouchableWithoutFeedback
} from "react-native";
import customFieldStyles from "../styles/customField";
import globalStyles from "../styles/global";

export default class CustomFieldList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }

  render() {
    const { value } = this.props;
    return (
      <View>
        <TouchableWithoutFeedback
          onPress={() => this.setState({ modalOpen: true })}
        >
          <View>
            <Text style={customFieldStyles.title}>{this.props.label}</Text>
            <Text>{value}</Text>
          </View>
        </TouchableWithoutFeedback>
        <Modal animationType="none" visible={this.state.modalOpen} transparent>
          <View style={styles.pickerContainer}>
            <TouchableWithoutFeedback
              onPress={() => this.setState({ modalOpen: false })}
            >
              <View style={styles.modalPlaceholder} />
            </TouchableWithoutFeedback>
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
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: "rgba(0,0,0,0.6)",
    flex: 1,
    justifyContent: "flex-end"
  },
  picker: {
    backgroundColor: globalStyles.primaryBackgroundColor
  },
  modalPlaceholder: {
    flex: 1
  }
});
