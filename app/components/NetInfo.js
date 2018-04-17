import React, { Component } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { connect } from "react-redux";
import { getNetInfo } from "../selectors/ui";
import globalStyles from "../styles/global";

class NetInfo extends Component {
  render() {
    if (this.props.netInfo.isConnected) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.props.netInfo.statusText}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalStyles.offlineBackgroundColor,
    padding: globalStyles.space,
    alignItems: "center",
    ...Platform.select({
      ios: {
        paddingTop: 20 + globalStyles.space
      }
    })
  },
  text: {
    color: globalStyles.offlineFontColor
  }
});

const mapStateToProps = state => ({
  netInfo: getNetInfo(state)
});

export default connect(mapStateToProps)(NetInfo);
