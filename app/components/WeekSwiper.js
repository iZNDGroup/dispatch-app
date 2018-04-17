import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from "react-native";
import moment from "moment";
import globalStyles from "../styles/global";

export default class WeekSwiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: props.selectedDate,
      weeks: []
    };
    this.swiperWidth = 300;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDate !== this.props.selectedDate) {
      this._updateWeeks(nextProps.selectedDate);
    }
  }

  _updateWeeks = date => {
    const firstDayOfWeek = moment(date).startOf("isoweek");
    this.setState({
      selectedDate: date,
      weeks: [
        this._createPrevWeek(firstDayOfWeek),
        this._createWeek(firstDayOfWeek),
        this._createNextWeek(firstDayOfWeek)
      ]
    });
    this._scrollToIndex(1);
  };

  _createWeek = date => {
    let week = [];
    for (var i = 0; i <= 6; i++) {
      week[i] = moment(date).add(i, "d");
    }
    return week;
  };

  _createNextWeek = date => {
    const firstDayNextWeek = moment(date).add(1, "w");
    return this._createWeek(firstDayNextWeek);
  };

  _createPrevWeek = date => {
    const firstDayPrevWeek = moment(date).subtract(1, "w");
    return this._createWeek(firstDayPrevWeek);
  };

  _renderDay = date => {
    const dayNr = moment(date).format("D");
    const isSelected = moment(date).isSame(
      moment(this.props.selectedDate),
      "d"
    );
    const isToday = moment(date).isSame(moment(), "d");
    const hasEvent = this.props.eventDates.includes(
      moment(date).format("YYYY-MM-DD")
    );
    return (
      <TouchableOpacity
        onPress={() => this.props.onDateSelect(date)}
        key={date}
      >
        <View style={[styles.day, isSelected && styles.selectedDate]}>
          <Text
            style={[
              isToday && styles.todayDateText,
              isSelected && styles.selectedDateText
            ]}
          >
            {dayNr}
          </Text>
        </View>
        {hasEvent && <View style={styles.eventIndicator} />}
      </TouchableOpacity>
    );
  };

  _swipeFinished = event => {
    const index = event.nativeEvent.contentOffset.x / this.swiperWidth;
    if (index === this.state.weeks.length - 1) {
      const lastWeek = this.state.weeks[this.state.weeks.length - 1];
      const firstDayLastWeek = lastWeek[0];
      const newWeek = this._createNextWeek(firstDayLastWeek);
      this.setState({
        weeks: [...this.state.weeks, newWeek]
      });
    } else if (index === 0) {
      const firstDayFirstWeek = this.state.weeks[0][0];
      const newWeek = this._createPrevWeek(firstDayFirstWeek);
      this.setState({
        weeks: [newWeek, ...this.state.weeks]
      });
      this._scrollToIndex(1);
    }
  };

  _scrollToIndex = index => {
    const width = index * this.swiperWidth;
    this._swiper.scrollTo({ x: width, animated: false });
  };

  render() {
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {days.map((day, index) => (
            <Text style={styles.headerText} key={index}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.swiper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: this.swiperWidth }}
            pagingEnabled
            onMomentumScrollEnd={this._swipeFinished}
            ref={component => (this._swiper = component)}
          >
            {this.state.weeks.map(week => (
              <View
                style={[styles.week, { width: this.swiperWidth }]}
                key={week}
              >
                {week.map(this._renderDay)}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: globalStyles.space
  },
  swiper: {
    width: 300
  },
  header: {
    height: 22,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  headerText: {
    width: 28,
    textAlign: "center",
    fontSize: globalStyles.smallestTextSize
  },
  week: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  day: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  selectedDate: {
    backgroundColor: globalStyles.secondaryColor
  },
  selectedDateText: {
    color: "white"
  },
  todayDateText: {
    color: globalStyles.secondaryColor
  },
  eventIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
    alignSelf: "center",
    backgroundColor: "#CCCCCC"
  }
});
