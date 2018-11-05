import React, { Component } from "react";
import ContactoScreen from "./ContactoScreen.js";
import { createStackNavigator } from "react-navigation";

export default (DrawNav = createStackNavigator({
  ContactoScreen: { screen: ContactoScreen }
}));
