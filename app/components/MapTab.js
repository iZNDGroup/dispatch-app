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

export default class MapTab extends Component {
  componentDidMount() {
    this._hardwareBackPress = hardwareBackPress(
      "map",
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
  }

  render() {
    return (
      <Navigator
        ref={component => {
          this._navigator = component;
        }}
        initialRoute={routes.mapView()}
        renderScene={renderScene}
        configureScene={configureScene}
      />
    );
  }
}

MapTab.contextTypes = {
  tabBar: PropTypes.object
};
