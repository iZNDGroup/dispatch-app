import PropTypes from "prop-types";
import React, { Component } from "react";
import { BackHandler } from "react-native";
import { Navigator } from "react-native-deprecated-custom-components";
import { routes } from "../navigation/config";
import {
  renderScene,
  configureScene,
  hardwareBackPress
} from "../navigation/util";

export default class CalendarTab extends Component {
  componentDidMount() {
    this._hardwareBackPress = hardwareBackPress(
      "calendar",
      this.context.tabBar,
      this._navigator
    );
    BackHandler.addEventListener("hardwareBackPress", this._hardwareBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this._hardwareBackPress
    );
    this._hardwareBackPress = null;
  }

  resetNavigator() {
    this._navigator.popToTop();
    if (this._currentComponent.scrollToTop) {
      this._currentComponent.scrollToTop();
    }
  }

  getCurrentComponent() {
    return this._currentComponent;
  }

  _renderScene = (route, navigator) => {
    return renderScene(route, navigator, component => {
      this._currentComponent = component
        ? component.getWrappedInstance()
        : null;
    });
  };

  render() {
    return (
      <Navigator
        ref={component => {
          this._navigator = component;
        }}
        initialRoute={routes.calendarList()}
        renderScene={this._renderScene}
        configureScene={configureScene}
      />
    );
  }
}

CalendarTab.contextTypes = {
  tabBar: PropTypes.object
};
