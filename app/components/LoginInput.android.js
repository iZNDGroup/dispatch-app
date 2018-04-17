import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, Animated } from "react-native";
import globalStyles from "../styles/global";

export default class LoginInput extends Component {
  constructor(props) {
    super(props);
    this.duration = 200;
    this.state = {
      focus: false,
      labelTop: this.props.value
        ? new Animated.Value(0)
        : new Animated.Value(18),
      labelFontSize: this.props.value
        ? new Animated.Value(globalStyles.smallestTextSize)
        : new Animated.Value(globalStyles.biggerTextSize)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value === "" && nextProps.value !== "") {
      this._minimizeLabel();
    }
  }

  _minimizeLabel = () => {
    Animated.timing(this.state.labelTop, {
      toValue: 0,
      duration: this.duration
    }).start();
    Animated.timing(this.state.labelFontSize, {
      toValue: globalStyles.smallestTextSize,
      duration: this.duration
    }).start();
  };

  _maximizeLabel = () => {
    Animated.timing(this.state.labelTop, {
      toValue: 18,
      duration: this.duration
    }).start();
    Animated.timing(this.state.labelFontSize, {
      toValue: globalStyles.biggerTextSize,
      duration: this.duration
    }).start();
  };

  _onFocus = () => {
    this.props.onFocus();
    this._minimizeLabel();
    this.setState({ focus: true });
  };

  _onBlur = () => {
    this.props.onBlur();
    this.setState({ focus: false });
    if (!this.props.value || this.props.value === "") {
      this._maximizeLabel();
    }
  };

  focus = () => {
    this.textInput.focus();
  };

  blur = () => {
    this.textInput.blur();
  };

  render() {
    return (
      <View style={styles.container}>
        <Animated.Text
          style={[
            styles.placeholderLabel,
            this.state.focus && styles.placeholderFocused,
            {
              top: this.state.labelTop,
              fontSize: this.state.labelFontSize
            }
          ]}
        >
          {this.props.label}
        </Animated.Text>
        <TextInput
          ref={component => {
            this.textInput = component;
          }}
          style={[
            styles.input,
            this.props.error && styles.inputError,
            this.state.focus && styles.inputFocused
          ]}
          underlineColorAndroid="rgba(0,0,0,0)"
          onFocus={this._onFocus}
          onBlur={this._onBlur}
          autoCorrect={false}
          onChangeText={this.props.onChangeText}
          value={this.props.value}
          keyboardType={this.props.keyboardType}
          secureTextEntry={this.props.secureTextEntry}
          onSubmitEditing={this.props.onSubmitEditing}
          returnKeyType={this.props.returnKeyType}
        />
        <Text style={styles.errorLabel}>{this.props.error}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    paddingTop: globalStyles.space * 1.5
  },
  input: {
    color: globalStyles.textFieldFontColor,
    fontSize: globalStyles.biggerTextSize,
    height: globalStyles.space * 4,
    padding: 0,
    margin: 0,
    textAlignVertical: "center",
    borderBottomWidth: globalStyles.textFieldBorderWidth,
    borderBottomColor: globalStyles.textFieldBorderColor,
    zIndex: 1001
  },
  inputFocused: {
    borderBottomColor: globalStyles.textFieldFocusedColor
  },
  inputError: {
    borderBottomColor: globalStyles.textFieldErrorColor
  },
  placeholderLabel: {
    position: "absolute",
    zIndex: 1000,
    color: "rgba(255,255,255,0.7)"
  },
  placeholderFocused: {
    color: globalStyles.textFieldFocusedColor
  },
  errorLabel: {
    color: globalStyles.textFieldErrorColor,
    fontSize: globalStyles.smallerTextSize,
    height: globalStyles.space * 3
  }
});
