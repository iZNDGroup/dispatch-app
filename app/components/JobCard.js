import React, { Component } from "react";
import { View } from "react-native";
import JobItem from "./JobItem";
import cardStyles from "../styles/card";

export default class JobCard extends Component {
  render() {
    return (
      <View style={[cardStyles.card, this.props.style]}>
        <JobItem
          job={this.props.item}
          onJobClick={this.props.onJobClick}
          onStatusClick={this.props.onStatusClick}
        />
      </View>
    );
  }
}
