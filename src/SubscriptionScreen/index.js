import React, { Component } from "react";
import SubscriptionScreen from "./SubscriptionScreen.js";
import ComprasSubsScreen from "./ComprasSubsScreen.js";
import { createStackNavigator } from "react-navigation";

export default (DrawNav = createStackNavigator({
  SubscriptionScreen: { screen: SubscriptionScreen },
  ComprasSubsScreen: { screen: ComprasSubsScreen }
}));
