import React, { Component } from "react";
import { Alert, Platform, StyleSheet, Switch, Text, View } from "react-native";
import deviceInfo from "react-native-device-info";
import Mailer from "react-native-mail";
import { connect } from "react-redux";
import * as actions from "../actions";
import {
  isLoggingEnabled,
  setLoggingEnabled,
  getLogFilePath
} from "../services/logging";
import * as userService from "../services/user";
import { localize } from "../util/localize";
import NavigationBar from "./NavigationBar";
import Touchable from "./Touchable";
import globalStyles from "../styles/global";

class SettingsTab extends Component {
  state = {
    userData: {},
    devMode: false,
    enableLogging: false
  };

  _devModeCounter = 0;

  async componentDidMount() {
    const [userData, enableLogging] = await Promise.all([
      userService.getUserData(),
      isLoggingEnabled()
    ]);
    this.setState({ userData, enableLogging });
  }

  _handleDevModePress = () => {
    this._devModeCounter++;
    if (this._devModeCounter >= 7) {
      this._devModeCounter = 0;
      this.setState({ devMode: true });
    }
  };

  _handleEnableLoggingChange = value => {
    this.setState({ enableLogging: value }, () => {
      setLoggingEnabled(value);
    });
  };

  _handleSendLog = () => {
    Mailer.mail(
      {
        recipients: ["support@gpsgate.com"],
        subject: "Dispatch app log file",
        body: "",
        attachment: {
          path: getLogFilePath(),
          type: "text", // iOS only (automatically set on Android)
          name: "log.txt" // iOS only (automatically set on Android)
        }
      },
      error => {
        if (error) {
          Alert.alert("Could not send log", error);
        }
      }
    );
  };

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
        <NavigationBar title={localize("Settings")} leftIcon={icon} />
        <View style={[styles.section, styles.noTopBorder]}>
          <View style={[styles.row, styles.noTopBorder]}>
            <Text>{localize("Username")}</Text>
            <Text style={styles.value}>{username}</Text>
          </View>
          <View style={styles.row}>
            <Text>{localize("Server")}</Text>
            <Text style={styles.value}>{baseUrl}</Text>
          </View>
          <View style={styles.row}>
            <Text>{localize("App Version")}</Text>
            <Text style={styles.value}>{appVersion}</Text>
          </View>
          <Touchable onPress={this._handleDevModePress}>
            <View style={styles.row}>
              <Text>{localize("Build Number")}</Text>
              <Text style={styles.value}>{buildNumber}</Text>
            </View>
          </Touchable>
          {(this.state.devMode || this.state.enableLogging) && (
            <View style={styles.row}>
              <Text>{localize("Enable Logging")}</Text>
              <Switch
                onValueChange={this._handleEnableLoggingChange}
                value={this.state.enableLogging}
              />
            </View>
          )}
          {this.state.enableLogging && (
            <Touchable onPress={this._handleSendLog}>
              <View style={styles.row}>
                <Text style={styles.buttonText}>
                  {Platform.OS === "ios"
                    ? localize("Send log")
                    : localize("Send log").toUpperCase()}
                </Text>
              </View>
            </Touchable>
          )}
        </View>
        <View style={styles.section}>
          <Touchable onPress={this._logout}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>
                {Platform.OS === "ios"
                  ? localize("Logout")
                  : localize("Logout").toUpperCase()}
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
        alignItems: "flex-start",
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
