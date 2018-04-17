import React, { Component } from "react";
import { AppState } from "react-native";
import { Provider } from "react-redux";
import configureLocale from "../util/locale";
import configureStore from "../store/configureStore";
import * as actions from "../actions";
import LoginContainer from "./LoginContainer";
import MainView from "./MainView";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      store: null
    };
  }

  _appStateChanged = appState => {
    switch (appState) {
      case "active":
        this.state.store.dispatch(actions.appResume());
        break;
      case "background":
        this.state.store.dispatch(actions.appPause());
        break;
      default:
    }
  };

  componentDidMount() {
    configureLocale();

    configureStore(store => {
      this.setState(
        {
          isLoading: false,
          store: store
        },
        () => {
          this.state.store.dispatch(actions.appOpen());
          AppState.addEventListener("change", this._appStateChanged);
        }
      );
    });
  }

  componentWillUnmount() {
    this.state.store.dispatch(actions.appClose());
    AppState.removeEventListener("change", this._appStateChanged);
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }
    return (
      <Provider store={this.state.store}>
        <LoginContainer>
          <MainView />
        </LoginContainer>
      </Provider>
    );
  }
}
