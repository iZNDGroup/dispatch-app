import PropTypes from "prop-types";
import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import NavigationBar from "./NavigationBar";
import HideTabView from "./HideTabView";
import ActionButtons from "./ActionButtons";
import CustomField from "./CustomField";
import Comments from "./Comments";
import globalStyles from "../styles/global";

export default class JobView extends Component {
  render() {
    const { showActions, job } = this.props;
    const { title, commentItems, location, scheduledTime, customFields } = job;
    return (
      <View style={styles.container}>
        <NavigationBar
          title={title}
          leftIcon="md-arrow-back"
          leftAction={this.props.goBack}
        />
        {showActions && (
          <ActionButtons
            status={this.props.job.status}
            onStart={this.props.startJob}
            onRoute={this.props.startAndRouteJob}
            onPause={this.props.pauseJob}
            onFinish={this.props.finishJob}
          />
        )}
        <HideTabView>
          <View style={styles.fieldsContainer}>
            {!!commentItems && (
              <View style={styles.field}>
                <Icon name="md-mail" style={styles.fieldIcon} />
                <Comments commentItems={commentItems} />
              </View>
            )}
            <View style={styles.field}>
              <Icon name="md-globe" style={styles.fieldIcon} />
              <Text style={styles.fieldValue}>{location.address || "-"}</Text>
              <Icon name="md-pin" style={styles.fieldExtraIcon} />
            </View>
            {!!scheduledTime && (
              <View style={styles.field}>
                <Icon name="md-time" style={styles.fieldIcon} />
                <Text style={styles.fieldValue}>
                  {moment(scheduledTime).calendar()}
                </Text>
              </View>
            )}
          </View>
          {customFields &&
            customFields.length > 0 && (
              <View style={styles.fieldsContainer}>
                {customFields.map(field => (
                  <CustomField
                    key={field.id}
                    {...field}
                    cfNamespace={"job"}
                    jobOrRouteId={job.id}
                    onSave={this.props.saveCustomField}
                    navigator={this.props.navigator}
                  />
                ))}
              </View>
            )}
        </HideTabView>
      </View>
    );
  }
}

JobView.defaultProps = {
  showActions: true
};

JobView.contextTypes = {
  tabBar: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.primaryBackgroundColor
  },
  fieldsContainer: {
    backgroundColor: globalStyles.secondaryBackgroundColor,
    padding: globalStyles.space * 2,
    marginBottom: globalStyles.space,
    elevation: 2
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: globalStyles.space,
    flex: 1
  },
  fieldIcon: {
    fontSize: globalStyles.iconSize,
    paddingRight: globalStyles.space * 2
  },
  fieldExtraIcon: {
    fontSize: globalStyles.iconSize
  },
  fieldValue: {
    color: globalStyles.primaryTextColor,
    flex: 1
  }
});
