import React, { Component } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import TouchableIcon from "./TouchableIcon";
import JobItem from "./JobItem";
import CustomField from "./CustomField";
import globalStyles from "../styles/global";
import cardStyles from "../styles/card";

export default class RouteCard extends Component {
  constructor(props) {
    super(props);
    this.state = { showCustomFields: false };
  }

  _toggleCustomFields = () => {
    this.setState(
      prevState => ({
        showCustomFields: !prevState.showCustomFields
      }),
      () => {
        const { showCustomFields } = this.state;
        const { item, onToggleCustomFields } = this.props;
        onToggleCustomFields(showCustomFields, item.id);
      }
    );
  };

  _renderCustomField(field, routeid) {
    field.value = field.value ? field.value.split("|")[0] : "";
    return (
      <View style={styles.fieldsContainer} key={field.id}>
        <CustomField
          key={field.id}
          {...field}
          cfNamespace={"route"}
          jobOrRouteId={routeid}
          navigator={this.props.navigator}
        />
      </View>
    );
  }

  _renderJob(job, index) {
    return (
      <View key={job.id} style={index > 0 && styles.separator}>
        <JobItem
          job={job}
          onJobClick={this.props.onJobClick}
          onStatusClick={this.props.onStatusClick}
        />
      </View>
    );
  }

  render() {
    let title = this.props.item.name;
    let icon = null;
    if (Platform.OS === "ios") {
      title = title.toUpperCase();
      icon = "ios-information-circle-outline";
    } else {
      icon = this.state.showCustomFields
        ? "md-arrow-dropup"
        : "md-arrow-dropdown";
    }
    return (
      <View style={[cardStyles.card, styles.container, this.props.style]}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableIcon
            icon={icon}
            color={globalStyles.routeCardIconColor}
            action={this._toggleCustomFields}
          />
        </View>
        {this.state.showCustomFields && (
          <Text style={styles.subtitle}>{this.props.item.note}</Text>
        )}
        {this.state.showCustomFields &&
          this.props.item.customFields.map(field =>
            this._renderCustomField(field, this.props.item.id)
          )}
        {this.props.item.jobs.map((job, index) => this._renderJob(job, index))}
        <View style={styles.bottom} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        borderBottomWidth: 0
      }
    })
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: globalStyles.routeCardBackgroundColor,
    ...Platform.select({
      ios: {
        paddingLeft: globalStyles.space * 2
      },
      android: {
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        padding: globalStyles.space * 2,
        paddingBottom: 0
      }
    })
  },
  title: {
    ...Platform.select({
      android: {
        fontSize: globalStyles.biggestTextSize
      }
    })
  },
  subtitle: {
    fontSize: globalStyles.normalTextSize,
    color: globalStyles.primaryTextColor,
    padding: globalStyles.space * 2,
    paddingTop: 0,
    backgroundColor: globalStyles.routeCardBackgroundColor
  },
  bottom: {
    ...Platform.select({
      ios: {
        borderTopWidth: 1,
        borderTopColor: globalStyles.lineColor,
        backgroundColor: globalStyles.routeCardBackgroundColor,
        height: globalStyles.space * 4
      }
    })
  },
  separator: {
    borderTopWidth: 1,
    borderTopColor: globalStyles.lineColor
  },
  fields: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: globalStyles.space * 2,
    backgroundColor: globalStyles.routeCardFieldsBackgroundColor
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: globalStyles.space,
    flex: 1
  },
  fieldKey: {
    fontSize: globalStyles.smallerTextSize,
    color: globalStyles.primaryTextColor
  },
  fieldValue: {
    fontSize: globalStyles.smallerTextSize,
    color: globalStyles.convertHex(globalStyles.primaryTextColor, 0.87)
  },
  fieldsContainer: {
    backgroundColor: globalStyles.secondaryBackgroundColor,
    padding: globalStyles.space * 2,
    marginBottom: globalStyles.space,
    elevation: 2
  }
});
