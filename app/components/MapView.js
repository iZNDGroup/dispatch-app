import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import { connect } from "react-redux";
import MapMarker from "./MapMarker";
import * as indexSelector from "../selectors";
import { routes } from "../navigation/config";
import globalStyles from "../styles/global";

class MapTab extends Component {
  constructor(props) {
    super(props);
    this.bgColors = [
      globalStyles.secondaryColor,
      globalStyles.orange,
      globalStyles.green
    ];
  }

  componentDidMount() {
    setTimeout(() => {
      this._map.fitToElements(true);
    }, 100);
  }

  _showJob = job => {
    this.props.navigator.push(routes.jobView(job.id, true));
  };

  _renderMarker = job => {
    const color = this.bgColors[job.status];
    const coordinate = {
      longitude: job.location.lng,
      latitude: job.location.lat
    };
    return (
      <MapMarker
        key={job.id}
        title={job.title}
        description={job.location.address}
        color={color}
        coordinate={coordinate}
        callback={() => this._showJob(job)}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          ref={component => {
            this._map = component;
          }}
        >
          {this.props.jobs.map(job => this._renderMarker(job))}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

const mapStateToProps = state => ({
  jobs: indexSelector.getJobsToday(state)
});

export default connect(mapStateToProps, null, null, { withRef: true })(MapTab);
