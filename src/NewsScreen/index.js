import React, { Component } from "react";
import NewsScreen from "./NewsScreen.js";
import { createStackNavigator } from "react-navigation";

export default (DrawNav = createStackNavigator({
  NewsScreen: { screen: NewsScreen },
}));
