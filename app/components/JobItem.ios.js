import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import TouchableIcon from "./TouchableIcon";
import globalStyles from "../styles/global";
import Swipeable from "react-native-swipeable";

export default class JobItem extends Component {
  constructor(props) {
    super(props);
    this.fadeValue = new Animated.Value(0);
  }

  componentDidMount() {
    if (this.props.job.new) {
      Animated.timing(this.fadeValue, { toValue: 1, duration: 1000 }).start(
        () => {
          Animated.timing(this.fadeValue, {
            toValue: 0,
            duration: 1000,
            delay: 10000
          }).start();
        }
      );
    }
  }

  _onJobClick = () => {
    this.props.onJobClick(this.props.job);
  };

  _onStatusClick = () => {
    this.swipeable.recenter();
    this.props.onStatusClick(this.props.job);
  };

  render() {
    const statusIcons = ["md-play", "md-checkbox-outline"];
    const statusTexts = ["START", "FINISH"];
    const statusColors = [globalStyles.orange, globalStyles.green];
    const borderColors = [
      globalStyles.lineColor,
      globalStyles.orange,
      globalStyles.green
    ];

    const statusIcon = statusIcons[this.props.job.status];
    const statusColor = statusColors[this.props.job.status];
    const statusText = statusTexts[this.props.job.status];
    const borderColor = borderColors[this.props.job.status];

    const bgColor = this.fadeValue.interpolate({
      inputRange: [0, 1],
      outputRange: [globalStyles.primaryBackgroundColor, globalStyles.green]
    });

    let rightButtons = null;
    if (this.props.onStatusClick && this.props.job.status <= 1) {
      rightButtons = [
        <View style={[styles.actionButton, { backgroundColor: statusColor }]}>
          <TouchableIcon
            icon={statusIcon}
            color={globalStyles.primaryBackgroundColor}
            text={statusText}
            action={this._onStatusClick}
            style={styles.actionIcon}
          />
        </View>
      ];
    }
    return (
      <Swipeable
        rightButtons={rightButtons}
        onRef={component => (this.swipeable = component)}
      >
        <TouchableOpacity onPress={this._onJobClick}>
          <Animated.View
            style={[styles.container, { backgroundColor: bgColor }]}
          >
            {!!this.props.job.scheduledTime && (
              <View style={styles.dateContainer}>
                <Icon name="ios-time-outline" />
                <Text style={styles.date}>
                  {moment(this.props.job.scheduledTime).format("LT")}
                </Text>
              </View>
            )}
            <View style={[styles.border, { backgroundColor: borderColor }]} />
            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={1}>
                {this.props.job.title}
              </Text>
              <Text style={styles.description} numberOfLines={1}>
                {this.props.job.location.address}
              </Text>
            </View>
            <Icon name="ios-arrow-forward" style={styles.infoIcon} />
          </Animated.View>
        </TouchableOpacity>
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: globalStyles.space * 2
  },
  content: {
    flex: 1,
    alignSelf: "flex-start"
  },
  title: {
    fontSize: globalStyles.normalTextSize
  },
  description: {
    opacity: 0.7,
    fontSize: globalStyles.smallestTextSize,
    marginTop: globalStyles.space / 2
  },
  dateContainer: {
    opacity: 0.5,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginRight: globalStyles.space * 2
  },
  date: {
    fontSize: globalStyles.smallerTextSize,
    marginLeft: globalStyles.space
  },
  border: {
    minWidth: 2,
    borderRadius: 2,
    marginRight: globalStyles.space * 2
  },
  infoIcon: {
    alignSelf: "center",
    fontSize: globalStyles.iconSize,
    height: globalStyles.iconSize,
    marginLeft: globalStyles.space * 2,
    color: globalStyles.convertHex(globalStyles.primaryTextColor, 0.1)
  },
  actionButton: {
    flex: 1,
    justifyContent: "center"
  },
  actionIcon: {
    width: 75
  }
});
