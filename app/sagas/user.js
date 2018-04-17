import { delay } from "redux-saga";
import { takeLatest, put, call, all, race } from "redux-saga/effects";
import * as actions from "../actions";
import * as userService from "../services/user";
import { isUrl, cleanUrl } from "../util/url";

export default function* userSaga() {
  yield all([
    takeLatest(actions.login.init, login),
    takeLatest(actions.logout.init, logout),
    takeLatest(actions.appOpen, autoLogin)
  ]);
}

function* login(action) {
  const { baseUrl, username, password } = action.payload;
  const { autoLogin } = action.meta || {};
  let success = false;
  let error = null;
  const errors = [];
  const transformFns = [
    baseUrl => cleanUrl(baseUrl),
    baseUrl => cleanUrl(`https://${baseUrl}`),
    baseUrl => cleanUrl(`http://${baseUrl}`)
  ];
  for (const transformFn of transformFns) {
    const testBaseUrl = transformFn(baseUrl);
    // console.debug("login", testBaseUrl);
    try {
      if (isUrl(testBaseUrl)) {
        const { loginContext } = yield race({
          loginContext: call(
            userService.login,
            testBaseUrl,
            username,
            password,
            autoLogin
          ),
          timeout: delay(10000)
        });
        if (loginContext) {
          yield put(actions.login.resolve(loginContext));
          success = true;
          break;
        } else {
          throw new Error(`${testBaseUrl} - Timeout`);
        }
      }
    } catch (err) {
      if (
        err.nativeError &&
        err.nativeError.message === "Wrong username or password"
      ) {
        error = err.nativeError.message;
        errors.push(err.nativeError.message);
        break;
      } else {
        errors.push(err.message);
      }
    }
  }
  if (!success) {
    // console.debug("login.errors", errors);
    yield put(
      actions.login.reject(new Error(error || "Unable to connect to server"))
    );
    if (autoLogin) {
      yield put(actions.logout.resolve());
    }
  }
}

function* logout() {
  try {
    yield call(userService.logout);
    yield put(actions.logout.resolve());
  } catch (err) {
    yield put(actions.logout.reject(err));
    yield put(actions.logout.resolve()); // TODO ?
  }
}

function* autoLogin() {
  const userData = yield call(userService.getUserData);
  if (userData) {
    yield put(actions.login.init(userData, { autoLogin: true }));
  }
}
