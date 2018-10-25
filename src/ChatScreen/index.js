import React, { Component } from "react";
import ChatScreen from "./ChatScreen.js";
import { createStackNavigator } from "react-navigation";

export default (DrawNav = createStackNavigator({
  ChatScreen: { screen: ChatScreen }
}));
