import React, { Component } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { connect } from "react-redux";
import deviceInfo from "react-native-device-info";
import * as actions from "../actions";
import * as userService from "../services/user";
import NavigationBar from "./NavigationBar";
import Touchable from "./Touchable";
import globalStyles from "../styles/global";

class SettingsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {}
    };
  }

  async componentDidMount() {
    const userData = await userService.getUserData();
    this.setState({ userData });
  }

  _logout = () => {
    this.props.logout();
  };

  render() {
    if (!this.state.userData) return null;
    const { username, baseUrl } = this.state.userData;
    const appVersion = deviceInfo.getVersion();
    const buildNumber = deviceInfo.getBuildNumber();
    const icon = Platform.OS === "android" ? "md-settings" : null;
    return (
      <View style={styles.container}>
        <NavigationBar title="Settings" leftIcon={icon} />
        <View style={[styles.section, styles.noTopBorder]}>
          <View style={[styles.row, styles.noTopBorder]}>
            <Text>Username</Text>
            <Text style={styles.value}>{username}</Text>
          </View>
          <View style={styles.row}>
            <Text>Server</Text>
            <Text style={styles.value}>{baseUrl}</Text>
          </View>
          <View style={styles.row}>
            <Text>App Version</Text>
            <Text style={styles.value}>{appVersion}</Text>
          </View>
          <View style={styles.row}>
            <Text>Build Number</Text>
            <Text style={styles.value}>{buildNumber}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Touchable onPress={this._logout}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>
                {Platform.OS === "ios" ? "Logout" : "LOGOUT"}
              </Text>
            </View>
          </Touchable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: globalStyles.primaryColor
      },
      android: {
        backgroundColor: globalStyles.primaryBackgroundColor
      }
    })
  },
  section: {
    ...Platform.select({
      ios: {
        marginBottom: globalStyles.space * 5,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: globalStyles.lineColor,
        backgroundColor: globalStyles.primaryBackgroundColor
      },
      android: {
        marginHorizontal: globalStyles.space * 2
      }
    })
  },
  noTopBorder: {
    borderTopWidth: 0
  },
  row: {
    borderTopWidth: 1,
    borderColor: globalStyles.lineColor,
    ...Platform.select({
      ios: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: globalStyles.space * 1.5,
        paddingRight: globalStyles.space * 1.5,
        marginLeft: globalStyles.space * 1.5
      },
      android: {
        flexDirection: "column",
        paddingVertical: globalStyles.space * 2,
        paddingHorizontal: globalStyles.space
      }
    })
  },
  value: {
    ...Platform.select({
      ios: {
        opacity: 0.7
      },
      android: {
        opacity: 0.5,
        fontSize: globalStyles.smallerTextSize
      }
    })
  },
  button: {
    ...Platform.select({
      ios: {
        padding: globalStyles.space * 1.5
      },
      android: {
        borderTopWidth: 1,
        borderColor: globalStyles.lineColor,
        paddingVertical: globalStyles.space * 2,
        paddingHorizontal: globalStyles.space
      }
    })
  },
  buttonText: {
    color: globalStyles.secondaryColor
  }
});

const mapDispatchToProps = {
  logout: actions.logout.init
};

export default connect(null, mapDispatchToProps)(SettingsTab);
