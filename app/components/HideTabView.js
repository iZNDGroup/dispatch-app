import PropTypes from "prop-types";
import React, { Component } from "react";
import { ScrollView, Platform } from "react-native";
import { toggleTabbar } from "../util/ui";

export default class HideTabView extends Component {
  _onScroll = event => {
    if (Platform.OS === "android") {
      toggleTabbar(event, this.context.tabBar);
    }
  };

  getScrollView = () => {
    return this._scrollView;
  };

  render() {
    return (
      <ScrollView
        contentContainerStyle={this.props.style}
        onScroll={this._onScroll}
        ref={component => {
          this._scrollView = component;
        }}
      >
        {this.props.children}
      </ScrollView>
    );
  }
}

HideTabView.contextTypes = {
  tabBar: PropTypes.object
};
