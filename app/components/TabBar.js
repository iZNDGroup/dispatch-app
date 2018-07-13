import React, { Component } from "react";
import { StyleSheet, Text, View, Animated, Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { localize } from "../util/localize";
import Touchable from "./Touchable";
import globalStyles from "../styles/global";

export default class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeOpacity: new Animated.Value(1),
      fadeMarginBottom: new Animated.Value(0)
    };
    this.isVirtuallyVisible = true;
  }

  hide() {
    this.isVirtuallyVisible = false;
    Animated.timing(this.state.fadeMarginBottom, { toValue: -56 }).start();
    Animated.timing(this.state.fadeOpacity, { toValue: 0 }).start();
  }

  show() {
    this.isVirtuallyVisible = true;
    Animated.timing(this.state.fadeMarginBottom, { toValue: 0 }).start();
    Animated.timing(this.state.fadeOpacity, { toValue: 1 }).start();
  }

  isVisible() {
    return this.isVirtuallyVisible;
  }

  _renderTab(tabLabel, page, isTabActive, onPressHandler) {
    return (
      <Touchable
        style={{ flex: 1 }}
        key={tabLabel.name}
        accessible
        accessibilityLabel={localize(tabLabel.name)}
        accessibilityTraits="button"
        onPress={() => onPressHandler(page)}
      >
        <View style={styles.tab}>
          <Icon
            name={tabLabel.icon}
            style={[styles.tabIcon, isTabActive && styles.tabIconActive]}
          />
          <Text style={[styles.tabText, isTabActive && styles.tabTextActive]}>
            {localize(tabLabel.name)}
          </Text>
        </View>
      </Touchable>
    );
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.tabs,
          this.props.style,
          {
            opacity: this.state.fadeOpacity,
            marginBottom: this.state.fadeMarginBottom
          }
        ]}
      >
        {this.props.tabs.map((tabLabel, page) => {
          const isTabActive = this.props.activeTab === page;
          return this._renderTab(
            tabLabel,
            page,
            isTabActive,
            this.props.goToPage
          );
        })}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  tabIcon: {
    color: globalStyles.tabBarItemColor,
    fontSize: globalStyles.iconSize
  },
  tabIconActive: {
    color: globalStyles.tabBarActiveItemColor
  },
  tabText: {
    color: globalStyles.tabBarItemColor,
    fontSize: globalStyles.smallestTextSize
  },
  tabTextActive: {
    color: globalStyles.tabBarActiveItemColor,
    ...Platform.select({
      android: {
        fontSize: globalStyles.normalTextSize
      }
    })
  },
  tabs: {
    height: Platform.OS === "ios" ? 49 : 56,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: globalStyles.tabBarBackgroundColor,
    ...Platform.select({
      ios: {
        borderColor: globalStyles.lineColor,
        borderTopWidth: 1
      },
      android: {
        elevation: 25
      }
    })
  }
});
