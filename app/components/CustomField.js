import PropTypes from "prop-types";
import React, { Component } from "react";
import { StyleSheet, View, Platform } from "react-native";
import CustomFieldText from "./CustomFieldText";
import CustomFieldMedia from "./CustomFieldMedia";
import CustomFieldCheckbox from "./CustomFieldCheckbox";
import CustomFieldList from "./CustomFieldList";

export default class CustomField extends Component {
  _onSave = newValue => {
    const { id, value, onSave } = this.props;
    if (newValue !== value) {
      onSave(id, newValue);
    }
  };

  render() {
    const { type } = this.props;
    let Component = null;
    if (type === "Text" || type === "Paragraph") {
      Component = <CustomFieldText {...this.props} onSave={this._onSave} />;
    } else if (type === "Checkbox") {
      Component = <CustomFieldCheckbox {...this.props} onSave={this._onSave} />;
    } else if (type === "List") {
      Component = <CustomFieldList {...this.props} onSave={this._onSave} />;
    } else if (type === "Number") {
      Component = (
        <CustomFieldText
          {...this.props}
          keyboard="numeric"
          onSave={this._onSave}
        />
      );
    } else if (type === "Media" || type === "Document") {
      Component = (
        <CustomFieldMedia
          key={"cfmedia_" + this.props.id}
          {...this.props}
          onSave={this._onSave}
        />
      );
    }
    return <View style={styles.container}>{Component}</View>;
  }
}

CustomField.propTypes = {
  type: PropTypes.oneOf([
    "Text",
    "Paragraph",
    "Checkbox",
    "List",
    "Number",
    "Media",
    "Document"
  ]).isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onSave: PropTypes.func,
  options: PropTypes.array
};

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        paddingVertical: 4
      },
      android: {
        padding: 4
      }
    })
  }
});
