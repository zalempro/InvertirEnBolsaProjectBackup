import React, { Component } from "react";
import ForumScreen    from "./ForumScreen.js";
import TemaScreen     from "./TemaScreen.js";
import EntradaScreen from "./EntradaScreen.js";
import NewReplyScreen from "./NewReplyScreen.js";
import NewTemaScreen from "./NewTemaScreen.js";
import ImageScreen from "./ImageScreen.js";

import { createStackNavigator } from "react-navigation";

export default (DrawNav = createStackNavigator({
  ForumScreen:    { screen: ForumScreen },
  TemaScreen:     { screen: TemaScreen },
  EntradaScreen:  { screen: EntradaScreen },
  NewReplyScreen: { screen: NewReplyScreen },
  NewTemaScreen: { screen: NewTemaScreen },
  ImageScreen: { screen: ImageScreen }
}));
