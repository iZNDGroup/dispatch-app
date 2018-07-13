import React, { Component } from "react";
import { StyleSheet, View, Text, Keyboard } from "react-native";
import moment from "moment";
import NavigationBar from "./NavigationBar";
import HideTabView from "./HideTabView";
import ActionButtons from "./ActionButtons";
import CustomField from "./CustomField";
import Comments from "./Comments";
import { localize } from "../util/localize";
import globalStyles from "../styles/global";

export default class JobView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marginBottom: 0
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = ev => {
    const keyboardHeight = ev.endCoordinates.height;
    this.setState({
      marginBottom: keyboardHeight
    });
  };

  _keyboardDidHide = ev => {
    this.setState({
      marginBottom: 0
    });
  };

  render() {
    const { showActions, job } = this.props;
    const { title, commentItems, location, scheduledTime, customFields } = job;
    return (
      <View style={styles.container}>
        <NavigationBar
          title={title}
          subtitle={scheduledTime ? moment(scheduledTime).calendar() : null}
          leftIcon="ios-arrow-back"
          leftText={localize("Jobs")}
          leftAction={this.props.goBack}
          extraBar={
            showActions && (
              <ActionButtons
                status={this.props.job.status}
                onStart={this.props.startJob}
                onRoute={this.props.startAndRouteJob}
                onPause={this.props.pauseJob}
                onFinish={this.props.finishJob}
              />
            )
          }
        />
        <HideTabView style={{ paddingBottom: this.state.marginBottom }}>
          <View style={styles.fieldsContainer}>
            {!!commentItems && (
              <View style={styles.field}>
                <Text style={styles.fieldKey}>{localize("Notes")}</Text>
                <Comments commentItems={commentItems} />
              </View>
            )}
            <View style={styles.field}>
              <Text style={styles.fieldKey}>{localize("Address")}</Text>
              <Text style={styles.fieldValue}>{location.address}</Text>
            </View>
            {!!scheduledTime && (
              <View style={[styles.field, styles.fieldNoLine]}>
                <Text style={styles.fieldKey}>{localize("Date")}</Text>
                <Text style={styles.fieldValue}>
                  {moment(scheduledTime).calendar()}
                </Text>
              </View>
            )}
          </View>
          {customFields &&
            customFields.length > 0 && <View style={styles.separator} />}
          {customFields &&
            customFields.length > 0 && (
              <View style={styles.fieldsContainer}>
                {customFields.map((field, i) => (
                  <View
                    style={[
                      styles.field,
                      i === customFields.length - 1 && styles.fieldNoBorder
                    ]}
                    key={field.id}
                  >
                    <CustomField
                      {...field}
                      cfNamespace={"job"}
                      jobOrRouteId={job.id}
                      onSave={this.props.saveCustomField}
                      navigator={this.props.navigator}
                    />
                  </View>
                ))}
              </View>
            )}
        </HideTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.primaryColor
  },
  separator: {
    paddingTop: globalStyles.space * 5,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.lineColor
  },
  fieldsContainer: {
    backgroundColor: globalStyles.secondaryBackgroundColor,
    padding: globalStyles.space * 2,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.lineColor
  },
  field: {
    flexDirection: "column",
    paddingTop: globalStyles.space,
    paddingBottom: globalStyles.space,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.lineColor
  },
  fieldNoBorder: {
    borderBottomWidth: 0
  },
  fieldKey: {
    fontSize: globalStyles.smallerTextSize,
    opacity: 0.5,
    marginBottom: globalStyles.space / 2
  },
  fieldValue: {
    color: globalStyles.primaryTextColor,
    flex: 1
  },
  fieldNoLine: {
    borderBottomWidth: 0
  }
});
