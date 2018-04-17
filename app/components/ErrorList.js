import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
import Touchable from "./Touchable";
import globalStyles from "../styles/global";
import * as uiSelector from "../selectors/ui";
import * as actions from "../actions";

class ErrorList extends Component {
  _clearErrors = () => {
    this.props.clearErrors();
  };

  render() {
    if (this.props.errors.length === 0) {
      return null;
    }
    // TODO: list all errors
    return (
      <Touchable onPress={this._clearErrors}>
        <View style={styles.container}>
          <Text style={styles.errorLabel}>{this.props.errors[0]}</Text>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: globalStyles.space,
    paddingBottom: globalStyles.space * 4
  },
  errorLabel: {
    color: "#f00",
    fontSize: globalStyles.biggerTextSize
  }
});

const mapStateToProps = state => ({
  errors: uiSelector.getErrors(state)
});

const mapDispatchToProps = {
  clearErrors: actions.clearErrors
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorList);
