import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import RouteCard from "./RouteCard";
import JobCard from "./JobCard";
import { localize } from "../util/localize";
import globalStyles from "../styles/global";

export default class CardList extends Component {
  _renderRow(item) {
    if (item.type === "job") {
      return (
        <JobCard
          key={`j${item.id}`}
          item={item}
          onJobClick={this.props.onJobClick}
          onStatusClick={this.props.onStatusClick}
          style={this.props.cardStyle}
        />
      );
    } else if (item.type === "route") {
      return (
        <RouteCard
          key={`r${item.id}`}
          item={item}
          onJobClick={this.props.onJobClick}
          onStatusClick={this.props.onStatusClick}
          onToggleCustomFields={this.props.onToggleCustomFields}
          style={this.props.cardStyle}
          navigator={this.props.navigator}
        />
      );
    }
  }

  render() {
    return (
      <View style={this.props.style}>
        {this.props.isLoading && (
          <ActivityIndicator animating size="large" style={styles.loader} />
        )}
        {!this.props.isLoading &&
          this.props.items.length === 0 && (
            <Text style={styles.emptyText}>
              {localize("There are no jobs today")}
            </Text>
          )}
        {this.props.items.map(item => this._renderRow(item))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    marginTop: globalStyles.space * 2
  },
  emptyText: {
    marginVertical: globalStyles.space * 2,
    alignSelf: "center"
  }
});
