import PropTypes from "prop-types";
import React, { Component } from "react";
import { StyleSheet, ActivityIndicator, Linking, Platform } from "react-native";
import { connect } from "react-redux";
import JobView from "./JobView";
import * as indexSelector from "../selectors";
import * as jobsSelector from "../selectors/jobs";
import * as actions from "../actions";
import globalStyles from "../styles/global";

class JobViewContainer extends Component {
  componentDidMount() {
    const { id, jobViewDidMount, requestJob } = this.props;
    jobViewDidMount(id);
    requestJob(id);
  }

  componentWillUnmount() {
    const { id, jobViewWillUnmount } = this.props;
    jobViewWillUnmount(id);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.job) {
      this._goBack();
    }
  }

  _goBack = () => {
    this.props.navigator.pop();
    this.context.tabBar.toggle(true);
  };

  _startJob = () => {
    this.props.startJob(this.props.job.id);
  };

  _pauseJob = () => {
    this.props.pauseJob(this.props.job.id);
  };

  _startAndRouteJob = () => {
    const { startJob, job } = this.props;
    const { title, location, id } = job;
    let url = null;
    if (Platform.OS === "ios") {
      url =
        "http://maps.apple.com/?q=" +
        title +
        "&ll=" +
        location.lat +
        "," +
        location.lng;
    } else {
      url = "google.navigation:q=" + location.lat + "," + location.lng;
    }
    Linking.openURL(url);
    startJob(id);
  };

  _finishJob = () => {
    this.props.finishJobDialog(this.props.job.id);
  };

  _saveCustomField = (customFieldId, customFieldValue) => {
    const jobId = this.props.job.id;
    this.props.saveCustomField({ jobId, customFieldId, customFieldValue });
  };

  render() {
    if (this.props.isLoading) {
      return <ActivityIndicator animating size="large" style={styles.loader} />;
    }
    if (!this.props.job) {
      return null;
    }
    return (
      <JobView
        {...this.props}
        goBack={this._goBack}
        startJob={this._startJob}
        pauseJob={this._pauseJob}
        startAndRouteJob={this._startAndRouteJob}
        finishJob={this._finishJob}
        saveCustomField={this._saveCustomField}
      />
    );
  }
}

JobViewContainer.defaultProps = {
  showActions: true
};

JobViewContainer.contextTypes = {
  tabBar: PropTypes.object
};

const styles = StyleSheet.create({
  loader: {
    marginTop: globalStyles.space * 2
  }
});

const createMapStateToProps = (initialState, initialProps) => {
  const jobId = initialProps.id;
  return state => ({
    job: indexSelector.getJobById(state, jobId),
    isLoading: jobsSelector.isLoading(state, jobId)
  });
};

const mapDispatchToProps = {
  jobViewDidMount: actions.jobViewDidMount,
  jobViewWillUnmount: actions.jobViewWillUnmount,
  requestJob: actions.requestJob.init,
  startJob: actions.startJob.init,
  pauseJob: actions.pauseJob.init,
  finishJobDialog: actions.finishJobDialog,
  saveCustomField: actions.saveCustomField.init
};

export default connect(createMapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(JobViewContainer);
