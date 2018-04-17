import React from "react";
import { Dimensions } from "react-native";
import { Navigator } from "react-native-deprecated-custom-components";
import { tabs, routes } from "./config.js";

export const renderScene = (route, navigator, refCallback = null) => {
  const Component = route.component;
  const props = route.props;
  return <Component navigator={navigator} {...props} ref={refCallback} />;
};

export const configureScene = (route, routeStack) => ({
  ...Navigator.SceneConfigs.PushFromRight,
  gestures: route.gestures
    ? {
        pop: {
          ...Navigator.SceneConfigs.PushFromRight.gestures.pop,
          edgeHitWidth: Dimensions.get("window").width / 2
        }
      }
    : null
});

export const hardwareBackPress = (tabId, tabBar, navigator) => () => {
  const activeTab = tabBar.getActiveTab();
  const currentRoutes = navigator.getCurrentRoutes();
  const currentRoute = currentRoutes[currentRoutes.length - 1];
  if (
    (activeTab && activeTab.id !== tabId) ||
    (currentRoute && currentRoute.id === routes.jobList().id)
  ) {
    return false;
  }
  if (currentRoutes.length === 1) {
    tabBar.goToTab(tabs.jobs, false);
  } else {
    navigator.pop();
  }
  return true;
};
