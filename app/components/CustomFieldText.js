import React, { Component } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform
} from "react-native";
import { showAlert } from "../util/ui";
import { localize } from "../util/localize";
import TouchableIcon from "./TouchableIcon";
import customFieldStyles from "../styles/customField";
import globalStyles from "../styles/global";

export default class CustomFieldText extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }

  _stripNumber = value => {
    value = value.replace(/[- ]/g, "");
    value = value.replace(/^\+/, "00");
    return value;
  };

  _makeCall = () => {
    const { value } = this.state;
    const action = Platform.OS === "ios" ? "telprompt" : "tel";
    const url = action + ":" + this._stripNumber(value);
    Linking.canOpenURL(url).then(canOpen => {
      if (!canOpen) {
        showAlert(localize("Could not make phone call"));
      } else {
        Linking.openURL(url).catch(err =>
          showAlert(localize("Could not make phone call"))
        );
      }
    });
  };

  _isPhoneNumber = value => {
    value = this._stripNumber(value);
    return /^\d{5,}$/g.test(value);
  };

  renderTextInput() {
    return (
      <View>
        <Text style={customFieldStyles.title}>{this.props.label}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={component => {
              this.input = component;
            }}
            keyboardType={this.props.keyboard}
            underlineColorAndroid={globalStyles.lineColor}
            style={[customFieldStyles.value, styles.textInput]}
            value={this.state.value}
            onSubmitEditing={() =>
              this.props.onSave && this.props.onSave(this.state.value)
            }
            onChangeText={value => this.setState({ value })}
          />
          {this._isPhoneNumber(this.state.value) && (
            <TouchableIcon icon="md-call" action={this._makeCall} />
          )}
        </View>
      </View>
    );
  }

  render() {
    if (Platform.OS === "ios") {
      return (
        <TouchableWithoutFeedback onPress={() => this.input.focus()}>
          {this.renderTextInput()}
        </TouchableWithoutFeedback>
      );
    } else {
      return this.renderTextInput();
    }
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    ...Platform.select({
      ios: {
        height: 24
      },
      android: {
        paddingTop: 0
      }
    })
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row"
  }
});
