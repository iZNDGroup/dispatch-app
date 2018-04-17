import React, { Component } from "react";
import { StyleSheet, View, Platform, SegmentedControlIOS } from "react-native";
import { connect } from "react-redux";
import NewJobsLabel from "./NewJobsLabel";
import HideTabView from "./HideTabView";
import CardList from "./CardList";
import NavigationBar from "./NavigationBar";
import globalStyles from "../styles/global";
import { routes } from "../navigation/config";
import * as indexSelector from "../selectors";
import * as uiSelector from "../selectors/ui";
import * as actions from "../actions";

class JobList extends Component {
  _showNewJobs = () => {
    this.props.showNewJobs(this.props.newJobIds);
    this.props.clearNewJobs(this.props.newJobIds);
    // TODO scroll to nearest new job in the list
  };

  _showJob = job => {
    this.props.navigator.push(routes.jobView(job.id));
  };

  _changeStatus = job => {
    if (job.status === 0) {
      this.props.startJob(job.id);
    } else if (job.status === 1) {
      this.props.finishJobDialog(job.id);
    } else if (job.status === 2) {
      this.props.hideJob(job.id);
    }
  };

  _toggleCustomFields = (showCustomFields, routeId) => {
    if (showCustomFields) {
      this.props.requestRoute(routeId);
    }
  };

  _changeList = event => {
    const index = event.nativeEvent.selectedSegmentIndex;
    if (index === 0) {
      this.props.showAll();
    } else {
      this.props.showPending();
    }
  };

  scrollToTop = () => {
    this._scrollContainer.getScrollView().scrollTo({ y: 0 });
  };

  render() {
    return (
      <View style={styles.container} {...this.props}>
        {Platform.OS === "ios" && (
          <NavigationBar
            title="Jobs"
            extraBar={
              <SegmentedControlIOS
                values={["All jobs", "Pending jobs"]}
                tintColor={globalStyles.navigationBarActionColor}
                selectedIndex={0}
                style={styles.segmentBar}
                onChange={this._changeList}
              />
            }
          />
        )}
        <NewJobsLabel
          quantity={this.props.newJobIds.length}
          callback={this._showNewJobs}
        />
        <HideTabView
          ref={component => {
            this._scrollContainer = component;
          }}
        >
          <CardList
            isLoading={this.props.isLoading}
            items={this.props.items}
            onJobClick={this._showJob}
            onStatusClick={this._changeStatus}
            onToggleCustomFields={this._toggleCustomFields}
            style={styles.topMargin}
          />
        </HideTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.primaryBackgroundColor
  },
  topMargin: {
    marginTop: globalStyles.space
  },
  segmentBar: {
    width: 300
  }
});

const mapStateToProps = state => ({
  isLoading: uiSelector.getIsLoading(state),
  items: indexSelector.getItemsToday(state),
  newJobIds: indexSelector.getNewJobIds(state)
});

const mapDispatchToProps = {
  showNewJobs: actions.showNewJobs,
  clearNewJobs: actions.clearNewJobs,
  startJob: actions.startJob.init,
  finishJobDialog: actions.finishJobDialog,
  hideJob: actions.hideJob,
  requestRoute: actions.requestRoute.init,
  showAll: actions.showAll,
  showPending: actions.showPending
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(JobList);
