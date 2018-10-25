import React, { Component } from "react";
import HomeScreen from "./HomeScreen.js";
import EntradaScreen from "../ForumScreen/EntradaScreen.js";
import ImageScreen from "../ForumScreen/ImageScreen.js";
import NewReplyScreen from "../ForumScreen/NewReplyScreen.js";
import { createStackNavigator } from "react-navigation";

export default (DrawNav = createStackNavigator({
  HomeScreen: { screen: HomeScreen },
  EntradaScreen:  { screen: EntradaScreen },
  ImageScreen:  { screen: ImageScreen },
  NewReplyScreen: { screen: NewReplyScreen}
}));