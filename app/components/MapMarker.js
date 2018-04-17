import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView from "react-native-maps";
import globalStyles from "../styles/global";

export default class MapMarker extends Component {
  _calloutPress = () => {
    this.props.callback();
  };

  render() {
    // Obs! Hidden text-component below is to force marker to re-render
    return (
      <MapView.Marker
        coordinate={this.props.coordinate}
        onCalloutPress={this._calloutPress}
        calloutAnchor={{ x: 0.5, y: 0.2 }}
      >
        <View style={[styles.marker, { borderColor: this.props.color }]}>
          <Text style={{ height: 0, width: 0 }}>{this.props.color}</Text>
        </View>
        <MapView.Callout style={styles.callout}>
          <Text style={styles.calloutTitle}>{this.props.title}</Text>
          <Text style={styles.calloutDescription}>
            {this.props.description}
          </Text>
        </MapView.Callout>
      </MapView.Marker>
    );
  }
}

const styles = StyleSheet.create({
  marker: {
    width: 24,
    height: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 0,
    borderWidth: 9,
    transform: [{ rotate: "-45deg" }],
    backgroundColor: "transparent",
    margin: 10
  },
  label: {
    color: globalStyles.invertedTextColor
  },
  callout: {
    width: 200,
    padding: globalStyles.space / 2
  },
  calloutTitle: {
    fontSize: globalStyles.normalTextSize,
    color: globalStyles.primaryTextColor
  },
  calloutDescription: {
    fontSize: globalStyles.smallestTextSize,
    marginTop: globalStyles.space / 2,
    color: globalStyles.convertHex(globalStyles.primaryTextColor, 0.58)
  }
});
