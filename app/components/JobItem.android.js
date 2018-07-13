import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Animated
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { localize } from "../util/localize";
import TouchableIcon from "./TouchableIcon";
import globalStyles from "../styles/global";

export default class JobItem extends Component {
  constructor(props) {
    super(props);
    // Animate when job is new in the list
    this.fadeValue = new Animated.Value(1);
    // Animate background when changing status
    this.colorValue = new Animated.Value(1);
    // Animate height when removing a job
    this.heightValue = new Animated.Value(100);
    // Animate vertical padding when removing job (otherwise animated height gets stuck)
    this.verticalPaddingValue = new Animated.Value(globalStyles.space * 2);
  }

  componentDidMount() {
    // Animated only if job is new
    if (this.props.job.new) {
      this.fadeValue.setValue(0);
      Animated.timing(this.fadeValue, { toValue: 1, duration: 1000 }).start();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.job.status !== nextProps.job.status) {
      // Reset before animation starts
      this.colorValue.setValue(0);
      Animated.timing(this.colorValue, { toValue: 1, duration: 1000 }).start();
    }
  }

  _onJobClick = () => {
    this.props.onJobClick(this.props.job);
  };

  _onStatusClick = () => {
    if (this.props.job.status === 2) {
      // User clicked on 'Hide' job
      Animated.timing(this.heightValue, { toValue: 0, duration: 1000 }).start(
        () => {
          this.props.onStatusClick(this.props.job);
        }
      );
      Animated.timing(this.verticalPaddingValue, {
        toValue: 0,
        duration: 1000
      }).start();
    } else {
      this.props.onStatusClick(this.props.job);
    }
  };

  _getTitleClass() {
    if (this.props.job.status === 0) {
      return styles.blackTitle;
    } else {
      return styles.whiteTitle;
    }
  }

  _getDescClass() {
    if (this.props.job.status === 0) {
      return styles.blackDesc;
    } else {
      return styles.whiteDesc;
    }
  }

  _getDateClass() {
    if (this.props.job.status === 0) {
      return styles.blackDate;
    } else {
      return styles.whiteDate;
    }
  }

  _getInfoIconClass() {
    if (this.props.job.status === 0) {
      return styles.blackInfoIcon;
    } else {
      return styles.whiteInfoIcon;
    }
  }

  render() {
    const statusIcons = ["md-play", "md-checkbox-outline", "md-close"];
    const statusTexts = ["START", "FINISH", "HIDE"];
    const statusColors = [
      globalStyles.green,
      globalStyles.invertedTextColor,
      globalStyles.invertedTextColor
    ];
    const statusBgColors = [
      globalStyles.invertedTextColor,
      globalStyles.orange,
      globalStyles.green
    ];

    const statusIcon = statusIcons[this.props.job.status];
    const statusColor = statusColors[this.props.job.status];
    const statusText = localize(statusTexts[this.props.job.status]);

    const bgColor = this.colorValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        globalStyles.secondaryBackgroundColor,
        statusBgColors[this.props.job.status]
      ]
    });

    return (
      <TouchableNativeFeedback onPress={this._onJobClick}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: bgColor,
              maxHeight: this.heightValue,
              paddingVertical: this.verticalPaddingValue,
              opacity: this.fadeValue
            }
          ]}
        >
          {!!this.props.job.scheduledTime && (
            <Text style={[styles.date, this._getDateClass()]}>
              {moment(this.props.job.scheduledTime).format("LT")}
            </Text>
          )}
          <View style={styles.content}>
            <Text
              style={[styles.title, this._getTitleClass()]}
              numberOfLines={1}
            >
              {this.props.job.title}
            </Text>
            <Text
              style={[styles.description, this._getDescClass()]}
              numberOfLines={1}
            >
              {this.props.job.location.address}
            </Text>
          </View>
          <Icon
            name="md-information-circle"
            style={[styles.infoIcon, this._getInfoIconClass()]}
          />
          {this.props.onStatusClick && (
            <View style={styles.actionButton}>
              <TouchableIcon
                icon={statusIcon}
                color={statusColor}
                text={statusText}
                action={this._onStatusClick}
              />
            </View>
          )}
        </Animated.View>
      </TouchableNativeFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: globalStyles.space * 2, // Vertical will be animated
    borderRadius: 2 // Inherit from Cards
  },
  content: {
    flex: 1,
    alignSelf: "flex-start"
  },
  title: {
    fontSize: globalStyles.normalTextSize
  },
  whiteTitle: {
    color: globalStyles.invertedTextColor
  },
  blackTitle: {
    color: globalStyles.primaryTextColor
  },
  description: {
    fontSize: globalStyles.smallestTextSize,
    marginTop: globalStyles.space / 2
  },
  blackDesc: {
    color: globalStyles.convertHex(globalStyles.primaryTextColor, 0.58)
  },
  whiteDesc: {
    color: globalStyles.convertHex(globalStyles.invertedTextColor, 0.58)
  },
  date: {
    fontSize: globalStyles.biggestTextSize,
    alignSelf: "flex-start",
    marginRight: globalStyles.space * 2
  },
  blackDate: {
    color: globalStyles.secondaryTextColor
  },
  whiteDate: {
    color: globalStyles.invertedTextColor
  },
  infoIcon: {
    fontSize: globalStyles.iconSize,
    marginLeft: globalStyles.space * 2
  },
  blackInfoIcon: {
    color: globalStyles.convertHex(globalStyles.primaryTextColor, 0.1)
  },
  whiteInfoIcon: {
    color: globalStyles.convertHex(globalStyles.invertedTextColor, 0.3)
  },
  actionButton: {
    marginLeft: globalStyles.space * 2
  }
});
