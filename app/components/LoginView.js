import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Platform,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import env from "../env";
import * as actions from "../actions";
import * as userSelector from "../selectors/user";
import globalStyles from "../styles/global";
import { collection, object } from "../util/immutable";
import ErrorList from "./ErrorList";
import LoginInput from "./LoginInput";
import Touchable from "./Touchable";

class LoginView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      endpoint: !env.Release ? env.DevEndpoint : "",
      username: !env.Release ? env.DevUsername : "",
      password: !env.Release ? env.DevPassword : "",
      error: {},
      imageSize: new Animated.Value(Platform.OS === "ios" ? 100 : 200),
      fadeAnim: new Animated.Value(0)
    };
  }

  componentDidMount() {
    Animated.timing(this.state.fadeAnim, { toValue: 1 }).start();
  }

  _onChangeEndpoint = value => {
    this.setState(prevState => {
      let newState = object.set(prevState, "endpoint", value);
      newState = collection.setIn(newState, ["error", "endpoint"], null);
      return newState;
    });
  };

  _onChangeUsername = value => {
    this.setState(prevState => {
      let newState = object.set(prevState, "username", value);
      newState = collection.setIn(newState, ["error", "username"], null);
      return newState;
    });
  };

  _onChangePassword = value => {
    this.setState(prevState => {
      let newState = object.set(prevState, "password", value);
      newState = collection.setIn(newState, ["error", "password"], null);
      return newState;
    });
  };

  _focusNextField = field => {
    field.focus();
  };

  _blurAndSubmit = field => {
    field.blur();
    this._doLogin();
  };

  _hideImage = () => {
    clearTimeout(this.timeout);
    Animated.timing(this.state.imageSize, { toValue: 0 }).start();
  };

  _showImage = () => {
    this.timeout = setTimeout(() => {
      Animated.timing(this.state.imageSize, { toValue: 200 }).start();
    }, 500);
  };

  _doLogin = () => {
    if (this.props.isLoading) {
      return;
    }
    this.props.clearErrors();
    if (this._validateForm()) {
      const { endpoint, username, password } = this.state;
      this.props.login({ baseUrl: endpoint, username, password });
    }
  };

  _validateForm = () => {
    const { endpoint, username, password } = this.state;
    const error = {};
    if (!endpoint) {
      error.endpoint = "Please enter a server URL";
    }
    if (!username) {
      error.username = "Please enter a username";
    }
    if (!password) {
      error.password = "Please enter a password";
    }
    this.setState({ error });
    return Object.values(error).length === 0;
  };

  render() {
    let usernameInput = null;
    let passwordInput = null;
    let endpointInput = null;
    if (Platform.OS === "ios") {
      endpointInput = (
        <LoginInput
          label="Server"
          icon="ios-globe-outline"
          keyboardType="url"
          error={this.state.error.endpoint}
          ref={component => (this.serverInput = component)}
          returnKeyType="next"
          onSubmitEditing={() => this._focusNextField(this.userInput)}
          value={this.state.endpoint}
          onChangeText={this._onChangeEndpoint}
        />
      );
      usernameInput = (
        <LoginInput
          label="Username"
          icon="ios-person-outline"
          error={this.state.error.username}
          ref={component => (this.userInput = component)}
          returnKeyType="next"
          onSubmitEditing={() => this._focusNextField(this.passInput)}
          value={this.state.username}
          onChangeText={this._onChangeUsername}
        />
      );
      passwordInput = (
        <LoginInput
          label="Password"
          icon="ios-lock-outline"
          secureTextEntry
          error={this.state.error.password}
          ref={component => (this.passInput = component)}
          returnKeyType="done"
          onSubmitEditing={() => this._blurAndSubmit(this.passInput)}
          value={this.state.password}
          onChangeText={this._onChangePassword}
        />
      );
    } else {
      endpointInput = (
        <LoginInput
          label="Server"
          keyboardType="url"
          error={this.state.error.endpoint}
          ref={component => {
            this.serverInput = component;
          }}
          returnKeyType="next"
          onSubmitEditing={() => this._focusNextField(this.userInput)}
          onFocus={this._hideImage}
          onBlur={this._showImage}
          value={this.state.endpoint}
          onChangeText={this._onChangeEndpoint}
        />
      );
      usernameInput = (
        <LoginInput
          label="Username"
          error={this.state.error.username}
          ref={component => {
            this.userInput = component;
          }}
          returnKeyType="next"
          onSubmitEditing={() => this._focusNextField(this.passInput)}
          onFocus={this._hideImage}
          onBlur={this._showImage}
          value={this.state.username}
          onChangeText={this._onChangeUsername}
        />
      );
      passwordInput = (
        <LoginInput
          label="Password"
          secureTextEntry
          error={this.state.error.password}
          ref={component => {
            this.passInput = component;
          }}
          returnKeyType="done"
          onSubmitEditing={() => this._blurAndSubmit(this.passInput)}
          onFocus={this._hideImage}
          onBlur={this._showImage}
          value={this.state.password}
          onChangeText={this._onChangePassword}
        />
      );
    }
    return (
      <Animated.ScrollView
        style={[styles.container, { opacity: this.state.fadeAnim }]}
      >
        <View style={styles.innerContainer}>
          <Animated.Image
            source={require("../resources/logo.png")}
            style={{
              height: this.state.imageSize,
              width: this.state.imageSize,
              alignSelf: "center"
            }}
          />
          {endpointInput}
          {usernameInput}
          {passwordInput}
          <Touchable onPress={this._doLogin}>
            <View style={[styles.button, this.props.style]}>
              {this.props.isLoading && <ActivityIndicator />}
              {!this.props.isLoading && (
                <Text style={styles.buttonLabel}>LOG IN</Text>
              )}
            </View>
          </Touchable>
          <ErrorList />
        </View>
      </Animated.ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.secondaryColor
  },
  innerContainer: {
    ...Platform.select({
      ios: {
        margin: globalStyles.space * 3
      },
      android: {
        margin: globalStyles.space
      }
    }),
    marginBottom: globalStyles.space * 5
  },
  button: {
    backgroundColor: globalStyles.secondaryBackgroundColor,
    height: Platform.OS === "ios" ? 48 : 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    marginTop: globalStyles.space,
    marginBottom: globalStyles.space * 3 // Otherwise keyboard suggestions will overlay the button
  },
  buttonLabel: {
    ...Platform.select({
      ios: {
        color: globalStyles.primaryTextColor,
        fontSize: globalStyles.biggerTextSize
      },
      android: {
        color: globalStyles.primaryColor,
        fontSize: globalStyles.normalTextSize,
        fontWeight: "bold"
      }
    })
  }
});

const mapStateToProps = state => ({
  isLoading: userSelector.getIsLoading(state)
});

const mapDispatchToProps = {
  login: actions.login.init,
  clearErrors: actions.clearErrors
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
