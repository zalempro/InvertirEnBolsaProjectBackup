import React, { Component } from "react";
import SubscripcionForoScreen from "./SubscripcionForoScreen.js";
import DetSubscripcionForoScreen from "./DetSubscripcionForoScreen.js";
import EntradaScreen from "../ForumScreen/EntradaScreen.js";
import ImageScreen from "../ForumScreen/ImageScreen.js";
import NewReplyScreen from "../ForumScreen/NewReplyScreen.js";
import ReportScreen from "../ForumScreen/ReportScreen.js";
import { createStackNavigator } from "react-navigation";

export default (DrawNav = createStackNavigator({
  SubscripcionForoScreen: { screen: SubscripcionForoScreen },
  DetSubscripcionForoScreen: { screen: DetSubscripcionForoScreen },
  EntradaScreen:  { screen: EntradaScreen },
  ImageScreen:  { screen: ImageScreen },
  NewReplyScreen: { screen: NewReplyScreen},
  ReportScreen: { screen: ReportScreen}
}));
