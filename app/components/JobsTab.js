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
import * as navigationService from "../navigation/service";

export default class JobsTab extends Component {
  componentDidMount() {
    this._hardwareBackPress = hardwareBackPress(
      "jobs",
      this.context.tabBar,
      this._navigator
    );
    BackHandler.addEventListener("hardwareBackPress", this._hardwareBackPress);

    navigationService.addNavigator("jobs", this._navigator);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this._hardwareBackPress
    );
    this._hardwareBackPress = null;

    navigationService.removeNavigator("jobs");
  }

  resetNavigator() {
    // TODO remove animation/transition (with configureScene?)
    this._navigator.popToTop();
    this._currentComponent.scrollToTop && this._currentComponent.scrollToTop();
  }

  getCurrentComponent() {
    return this._currentComponent;
  }

  _renderScene = (route, navigator) => {
    return renderScene(route, navigator, component => {
      this._currentComponent = component
        ? component.getWrappedInstance() // component.getWrappedInstance && component.getWrappedInstance()
        : null;
    });
  };

  render() {
    return (
      <Navigator
        ref={component => {
          this._navigator = component;
        }}
        initialRoute={routes.jobList()}
        renderScene={this._renderScene}
        configureScene={configureScene}
      />
    );
  }
}

JobsTab.contextTypes = {
  tabBar: PropTypes.object
};
