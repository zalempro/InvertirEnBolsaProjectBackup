import React, { Component } from "react";
import Expo from "expo";
import HomeScreen from "./src/HomeScreen/index.js";

import OneSignal from 'react-native-onesignal';
import Utils from './src/Utils/Utils.js';
import { Platform } from 'react-native';

export default class AwesomeApp extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  async componentWillMount() {

    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("native-base/Fonts/Ionicons.ttf"),
      HelveticaNeue: require("./assets/fonts/HelveticaNeue.ttf")
    });

    if (Platform.OS==="ios") {
      OneSignal.init("8432ebae-b0c5-4b7a-82b3-67923e4ae7de");
    } else {
      OneSignal.init("d12d0a74-10f2-46ec-adf1-7625a39d183c");
    }
    //OneSignal.addEventListener('received', this.onReceived);
    //OneSignal.addEventListener('opened', this.onOpened);
    //console.log("Event: OneSignal manu")
    OneSignal.addEventListener('ids', this.onIds);

    this.setState({ isReady: true });
  }

  componentWillUnmount() {
//    OneSignal.removeEventListener('received', this.onReceived);
//    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
//    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
/*    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult); */
  }

  onIds(device) {
    //console.log('on IDS ');
    if ((device != undefined) && (device.userId != null)) {
      //console.log('App JS: Device ID: ', device.userId);
      let util = new Utils();
      util.saveKey("AuthIEB","userIdToken",device.userId);
    }
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    return <HomeScreen />;
  }
}
