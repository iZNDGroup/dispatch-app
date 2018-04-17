import React, { Component } from "react";
import { Navigator } from "react-native-deprecated-custom-components";
import { connect } from "react-redux";
import { routes } from "../navigation/config";
import { renderScene } from "../navigation/util";
import * as userSelector from "../selectors/user";

class LoginContainer extends Component {
  render() {
    if (this.props.isLoggedIn) {
      return this.props.children;
    } else {
      return (
        <Navigator
          initialRoute={routes.loginView()}
          renderScene={renderScene}
          configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        />
      );
    }
  }
}

const mapStateToProps = state => ({
  isLoggedIn: userSelector.getIsLoggedIn(state)
});

export default connect(mapStateToProps)(LoginContainer);
