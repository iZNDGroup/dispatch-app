import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import globalStyles from "../styles/global";
import Icon from "react-native-vector-icons/Ionicons";

export default class LoginInput extends Component {
  focus = () => {
    this.textInput.focus();
  };

  blur = () => {
    this.textInput.blur();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Icon name={this.props.icon} style={styles.inputIcon} />
          <TextInput
            ref={component => (this.textInput = component)}
            style={[styles.input, this.props.error && styles.inputError]}
            selectionColor={globalStyles.textFieldFontColor}
            autoCorrect={false}
            onChangeText={this.props.onChangeText}
            value={this.props.value}
            keyboardType={this.props.keyboardType}
            secureTextEntry={this.props.secureTextEntry}
            onSubmitEditing={this.props.onSubmitEditing}
            returnKeyType={this.props.returnKeyType}
            placeholder={this.props.label}
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
        </View>
        <Text style={styles.errorLabel}>{this.props.error}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: globalStyles.space * 1.5
  },
  input: {
    flex: 1,
    color: globalStyles.textFieldFontColor,
    fontSize: globalStyles.biggerTextSize,
    height: globalStyles.space * 4,
    padding: 0,
    margin: 0,
    textAlignVertical: "center",
    zIndex: 1001
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: globalStyles.textFieldBorderColor,
    borderBottomWidth: globalStyles.textFieldBorderWidth
  },
  inputIcon: {
    marginRight: globalStyles.space * 1.5,
    marginLeft: globalStyles.space * 0.5,
    fontSize: globalStyles.iconSize,
    color: globalStyles.textFieldFontColor
  },
  inputError: {
    borderBottomColor: globalStyles.textFieldErrorColor
  },
  errorLabel: {
    color: globalStyles.textFieldErrorColor,
    fontSize: globalStyles.smallerTextSize,
    height: globalStyles.space * 3
  }
});
