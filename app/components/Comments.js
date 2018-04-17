import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import globalStyles from "../styles/global";
import moment from "moment";

export default class Comments extends Component {
  // <Text style={styles.fieldValue}>{description[0].commentText}</Text>
  renderComments = comment => {
    const formattedDatetime = moment(comment.created)
      .local()
      .format("MM/DD/YYYY hh:mm:ss");
    return (
      <View key={formattedDatetime}>
        {comment.userID !== -2 && (
          <Text style={styles.commentWriterStyle}>
            {comment.userName + " - " + formattedDatetime}
          </Text>
        )}
        <Text style={styles.commentTextStyle}>{comment.commentText}</Text>
      </View>
    );
  };

  render() {
    const { commentItems } = this.props;
    return <View>{commentItems.map(this.renderComments)}</View>;
  }
}

const styles = StyleSheet.create({
  commentWriterStyle: {
    color: globalStyles.secondaryTextColor
  },
  commentTextStyle: {
    color: globalStyles.primaryTextColor
  }
});
