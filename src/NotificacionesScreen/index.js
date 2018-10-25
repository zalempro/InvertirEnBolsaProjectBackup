import React, { Component } from "react";
import NotificacionesScreen from "./NotificacionesScreen.js";
import { createStackNavigator } from "react-navigation";

export default (DrawNav = createStackNavigator({
  NotificacionesScreen: { screen: NotificacionesScreen }
}));
