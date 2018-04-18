# [Dispatch](https://gpsgate.com/) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE)

Dispatch is a [React Native](https://github.com/facebook/react-native) application for managing Dispatch worker jobs in [GpsGate](https://gpsgate.com).

* **Cross platform:** The business logic of the app leverages the [React Native](https://github.com/facebook/react-native) framework and is written in platform-agnostic JavaScript with minimal use of native code. This means that new features and fixes only need to be applied in one place to target both iOS and Android. The app features platform specific user interfaces to make sure that workers get the experience they expect from their chosen mobile platform.
* **Event-driven:** Dispatch uses an event driven design pattern featuring push based server communication, [rxjs](http://reactivex.io/rxjs/) driven model updates and [redux-saga](https://github.com/redux-saga/redux-saga) to manage its side effects.
* **Offline capable:** The app keeps track of all changes that the user makes while operating offline and synchronises its data with the server at the first available opportunity

## Getting Started

These instructions will get you a copy of the project up and running for development and testing purposes.

### Prerequisites

You will need to have [Node](https://nodejs.org/en/download/) installed on your development machine to build and run tests

You must install the React Native CLI globally after installing Node.

```
npm install -g react-native-cli
```

### Installing

Clone the dispatch-app repository to your local machine

```
mkdir gpsgate
cd gpsgate
git clone https://github.com/gpsgate/dispatch-app.git
cd dispatch-app
npm install
```

### Developing
Once you have installed [Node](https://nodejs.org/en/download/) on your machine you will need to set up an app development environment.

Development on dispatch-app can be done in your web development IDE of choice. All business logic and UI code is written in JavaScript and [JSX](https://reactjs.org/docs/jsx-in-depth.html). We develop using [Visual Studio Code](https://code.visualstudio.com).

If you have Visual Studio Code installed, make sure you are still in the dispatch-app directory and write

```
code .
```

If you would like to run the project to test on an emulator or a device, you will need to follow the instructions below. The Android app can be compiled and run on Windows, Linux and MacOS. The iOS app can currently only be compiled and run on MacOS.

* React Native help article for all platforms: [Running on Device](https://facebook.github.io/react-native/docs/running-on-device.html).


### Running the tests

To run the tests on your development environment, make sure you are in the dispatch-app directory and use the command

```
npm run test
```

To run the code quality check use the command

```
npm run eslint
```

To make sure that the code is formatted correctly use the command

```
npm run prettier
```




## [Code of Conduct](https://github.com/gpsgate/dispatch-app/blob/master/code-of-conduct.md)

GpsGate applies the contributor covenent code of conduct that we expect project participants to adhere to. Please read [the full text](https://github.com/gpsgate/dispatch-app/blob/master/code-of-conduct.md) so that you are aware of the standards of behaviour we expect on our Github repositories.

## License

Dispatch is [MIT licensed](./LICENSE).


## Built With

* [react-native](https://github.com/facebook/react-native)
* [react-native-calendar](https://github.com/christopherdro/react-native-calendar)
* [react-native-cookie](https://github.com/shimohq/react-native-cookie)
* [react-native-device-info](https://github.com/rebeccahughes/react-native-device-info)
* [react-native-dialogs](https://github.com/aakashns/react-native-dialogs)
* [react-native-fcm](https://github.com/evollu/react-native-fcm)
* [react-native-fetch-blob](https://github.com/wkh237/react-native-fetch-blob)
* [react-native-file-opener](https://github.com/huangzuizui/react-native-file-opener)
* [react-native-fs](https://github.com/itinance/react-native-fs)
* [react-native-i18n](https://github.com/AlexanderZaytsev/react-native-i18n)
* [react-native-image-picker](https://github.com/react-community/react-native-image-picker)
* [react-native-maps](https://github.com/react-community/react-native-maps)
* [react-native-parallax-scroll-view](https://github.com/i6mi6/react-native-parallax-scroll-view)
* [react-native-photo-view](https://github.com/alwx/react-native-photo-view)
* [react-native-scrollable-tab-view](https://github.com/skv-headless/react-native-scrollable-tab-view)
* [react-native-sketch-canvas](https://github.com/terrylinla/react-native-sketch-canvas)
* [react-native-swipeable](https://github.com/jshanson7/react-native-swipeable)
* [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)
* [react-redux](https://github.com/reactjs/react-redux)
* [redux](https://github.com/reactjs/redux)
* [redux-saga](https://github.com/redux-saga/redux-saga)
* [reselect](https://github.com/reactjs/reselect)
* [rxjs](https://github.com/ReactiveX/rxjs)
* [moment](https://github.com/moment/moment)
* [timm](https://github.com/guigrpa/timm)