import PropTypes from "prop-types";
import React, { Component } from "react";
import { Animated, StyleSheet } from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { tabs } from "../navigation/config";
import globalStyles from "../styles/global";
import { configurePhraseBook } from "../util/localize";
import NetInfo from "./NetInfo";
import TabBar from "./TabBar";

export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languageLoaded: false,
      fadeAnim: new Animated.Value(0)
    };
  }

  componentDidMount() {
    configurePhraseBook().then(() => {
      this.setState({ languageLoaded: true });
      Animated.timing(this.state.fadeAnim, { toValue: 1 }).start();
    });
  }

  toggleTabBar = show => {
    if (show && !this._tabBar.isVisible()) {
      this._tabBar.show();
    } else if (!show && this._tabBar.isVisible()) {
      this._tabBar.hide();
    }
  };

  goToTab = (tab, resetStack = false) => {
    tab = this._tabs[tab.index];
    if (tab) {
      this._tabBar.props.goToPage(tab.index);
      if (resetStack && tab.componentRef.resetNavigator) {
        tab.componentRef.resetNavigator();
      }
    }
  };

  getActiveTab = () => {
    return this._tabs[this._tabBar.props.activeTab];
  };

  _registerTab = (tab, component) => {
    if (!this._tabs) {
      this._tabs = {};
    }
    this._tabs[tab.index] = Object.assign({}, tab, { componentRef: component });
  };

  _changeTab = tab => {
    tab = this._tabs[tab.i];
    const currentTab = tab.id;
    const prevTab = this.prevTab || this._tabs[0].id;
    if (prevTab === currentTab && tab.componentRef.resetNavigator) {
      tab.componentRef.resetNavigator();
    }
    this.prevTab = currentTab;
  };

  getChildContext() {
    return {
      tabBar: {
        toggle: this.toggleTabBar,
        goToTab: this.goToTab,
        getActiveTab: this.getActiveTab
      }
    };
  }

  render() {
    if (!this.state.languageLoaded) {
      return null;
    }
    return (
      <Animated.View
        style={[styles.container, { opacity: this.state.fadeAnim }]}
      >
        <NetInfo />
        <ScrollableTabView
          initialPage={0}
          locked
          tabBarPosition="bottom"
          renderTabBar={() => (
            <TabBar
              ref={component => {
                this._tabBar = component;
              }}
            />
          )}
          onChangeTab={this._changeTab}
        >
          {Object.values(tabs).map(tab => (
            <tab.component
              key={tab.id}
              tabLabel={tab.label}
              ref={component => {
                this._registerTab(tab, component);
              }}
            />
          ))}
        </ScrollableTabView>
      </Animated.View>
    );
  }
}

MainView.childContextTypes = {
  tabBar: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.primaryBackgroundColor
  }
});
