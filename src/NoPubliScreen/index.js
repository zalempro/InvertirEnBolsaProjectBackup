import React, { Component } from "react";
import NoPubliScreen from "./NoPubliScreen.js";
import { createStackNavigator } from "react-navigation";

export default (DrawNav = createStackNavigator({
  NoPubliScreen: { screen: NoPubliScreen },
}));
