import PropTypes from "prop-types";
import React, { Component } from "react";
import { StyleSheet, Platform, Text, View } from "react-native";
import { connect } from "react-redux";
import Calendar from "react-native-calendar";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import moment from "moment";
import NavigationBar from "./NavigationBar";
import CardList from "./CardList";
import WeekSwiper from "./WeekSwiper";
import globalStyles from "../styles/global";
import { tabs, routes } from "../navigation/config";
import { toggleTabbar } from "../util/ui";
import * as indexSelector from "../selectors";
import * as calendarSelector from "../selectors/calendar";
import * as actions from "../actions";

class CalendarList extends Component {
  componentWillMount() {
    const tomorrow = moment().add(1, "d");
    this._startDate = tomorrow;
  }

  _onDateSelect = d => {
    const date = moment(d);
    const today = moment();
    if (date.isSame(today, "d")) {
      this.context.tabBar.goToTab(tabs.jobs, true);
    } else {
      this.props.selectDate(date);
    }
  };

  _onMonthSelect = d => {
    this.props.selectMonth(d);
  };

  _showJob = job => {
    this.props.navigator.push(routes.jobView(job.id, false));
  };

  _toggleCustomFields = (showCustomFields, routeId) => {
    if (showCustomFields) {
      this.props.requestRoute(routeId);
    }
  };

  _onScroll = event => {
    if (Platform.OS === "android") {
      toggleTabbar(event, this.context.tabBar);
    }
  };

  scrollToTop = () => {
    this._scrollView.scrollTo({ y: 0 });
  };

  render() {
    const title = moment(this.props.selectedDate).format("ddd, MMM D");
    const month = moment(this.props.selectedDate).format("MMMM");
    const year = moment(this.props.selectedDate).format("YYYY");

    let CalendarComponent = null;
    let StickyHeaderComponent = null;
    let ForegroundComponent = null;
    let parallaxOptions = null;
    if (Platform.OS === "ios") {
      parallaxOptions = {
        parallaxHeaderHeight: 310,
        stickyHeaderHeight: 130,
        snapToInterval: 190
      };
      CalendarComponent = (
        <Calendar
          onDateSelect={this._onDateSelect}
          onTouchNext={this._onMonthSelect}
          onTouchPrev={this._onMonthSelect}
          startDate={this._startDate}
          selectedDate={this.props.selectedDate}
          eventDates={this.props.eventDates}
          showEventIndicators
          showControls={false}
          customStyle={calendarStyles}
          scrollEnabled
        />
      );
      StickyHeaderComponent = (
        <NavigationBar
          title={title}
          leftAction={this.scrollToTop}
          leftIcon="ios-arrow-back"
          leftText={month}
          extraBar={
            <WeekSwiper
              selectedDate={this.props.selectedDate}
              eventDates={this.props.eventDates}
              onDateSelect={this._onDateSelect}
            />
          }
        />
      );
      ForegroundComponent = CalendarComponent;
    } else {
      parallaxOptions = {
        parallaxHeaderHeight: 100,
        stickyHeaderHeight: 56,
        snapToInterval: null
      };
      CalendarComponent = (
        <Calendar
          onDateSelect={this._onDateSelect}
          onTouchNext={this._onMonthSelect}
          onTouchPrev={this._onMonthSelect}
          startDate={this._startDate}
          selectedDate={this.props.selectedDate}
          eventDates={this.props.eventDates}
          showEventIndicators
          showControls
          customStyle={calendarStyles}
        />
      );
      StickyHeaderComponent = (
        <NavigationBar
          title={title}
          barAction={this.scrollToTop}
          leftIcon="md-calendar"
        />
      );
      ForegroundComponent = (
        <View style={[styles.bar, { height: 100 }]}>
          <Text style={styles.year}>{year}</Text>
          <Text style={styles.date}>{title}</Text>
        </View>
      );
    }

    return (
      <ParallaxScrollView
        ref={component => {
          this._scrollView = component;
        }}
        backgroundColor={globalStyles.primaryColor}
        contentBackgroundColor={globalStyles.primaryBackgroundColor}
        parallaxHeaderHeight={parallaxOptions.parallaxHeaderHeight}
        stickyHeaderHeight={parallaxOptions.stickyHeaderHeight}
        snapToInterval={parallaxOptions.snapToInterval}
        onScroll={this._onScroll}
        renderStickyHeader={() => StickyHeaderComponent}
        renderForeground={() => ForegroundComponent}
      >
        {Platform.OS === "android" && CalendarComponent}
        <CardList
          isLoading={this.props.isLoading}
          items={this.props.items}
          onJobClick={this._showJob}
          onToggleCustomFields={this._toggleCustomFields}
          cardStyle={styles.fullWidth}
        />
      </ParallaxScrollView>
    );
  }
}

CalendarList.contextTypes = {
  tabBar: PropTypes.object
};

const styles = StyleSheet.create({
  bar: {
    backgroundColor: globalStyles.primaryColor,
    justifyContent: "center",
    paddingLeft: globalStyles.space * 2
  },
  year: {
    color: globalStyles.convertHex(globalStyles.invertedTextColor, 0.75),
    fontSize: globalStyles.biggerTextSize
  },
  date: {
    color: globalStyles.invertedTextColor,
    fontSize: 34
  },
  fullWidth: {
    marginHorizontal: 0,
    borderRadius: 0
  }
});

const calendarStyles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: globalStyles.secondaryBackgroundColor,
    ...Platform.select({
      ios: {
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: globalStyles.lineColor
      },
      android: {
        elevation: 5
      }
    })
  },
  calendarHeading: {
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  title: {
    fontSize: globalStyles.normalTextSize,
    color: globalStyles.primaryTextColor,
    fontWeight: "bold"
  },
  dayHeading: {
    fontSize: globalStyles.normalTextSize,
    color: globalStyles.secondaryTextColor
  },
  weekendHeading: {
    fontSize: globalStyles.normalTextSize,
    color: globalStyles.secondaryTextColor
  },
  day: {
    fontSize: globalStyles.normalTextSize,
    color: globalStyles.primaryTextColor
  },
  dayButton: {
    borderTopWidth: 0
  },
  weekendDayButton: {
    backgroundColor: globalStyles.secondaryBackgroundColor
  },
  weekendDayText: {
    color: globalStyles.primaryTextColor
  },
  currentDayText: {
    ...Platform.select({
      ios: {
        color: globalStyles.secondaryColor
      },
      android: {
        color: globalStyles.primaryTextColor,
        fontWeight: "bold"
      }
    })
  },
  currentDayCircle: {
    backgroundColor: globalStyles.secondaryColor
  },
  selectedDayCircle: {
    ...Platform.select({
      ios: {
        backgroundColor: globalStyles.secondaryColor
      },
      android: {
        borderWidth: 2,
        borderColor: globalStyles.primaryTextColor,
        backgroundColor: globalStyles.secondaryBackgroundColor
      }
    })
  },
  hasEventDaySelectedCircle: {
    ...Platform.select({
      android: {
        borderWidth: 2,
        borderColor: globalStyles.secondaryColor,
        backgroundColor: globalStyles.secondaryBackgroundColor
      }
    })
  },
  selectedDayText: {
    ...Platform.select({
      ios: {
        fontWeight: "normal"
      },
      android: {
        color: globalStyles.primaryTextColor
      }
    })
  },
  hasEventText: {
    ...Platform.select({
      android: {
        color: globalStyles.secondaryColor
      }
    })
  },
  eventIndicator: {
    ...Platform.select({
      android: {
        height: 0
      }
    })
  }
});

const mapStateToProps = state => ({
  selectedDate: calendarSelector.getSelectedDate(state),
  isLoading: indexSelector.getIsLoading(state),
  items: indexSelector.getItemsByDate(state),
  eventDates: indexSelector.getEventDates(state)
});

const mapDispatchToProps = {
  selectDate: actions.selectDate,
  selectMonth: actions.selectMonth,
  requestRoute: actions.requestRoute.init
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(CalendarList);
