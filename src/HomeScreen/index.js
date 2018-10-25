import React, { Component } from "react";
import HomeScreen from "./indexHome.js";
import NoPubliScreen from "../NoPubliScreen/index.js";
import NewsScreen from "../NewsScreen/index.js";
import ForumScreen from "../ForumScreen/index.js";
import EmpresasBDScreen from "../EmpresasBDScreen/index.js";
import MainScreenNavigator from "../ChatScreen/index.js";
import Profile from "../ProfileScreen/index.js";
import SideBar from "../SideBar/SideBar.js";
import SubscriptionScreen from "../SubscriptionScreen/index.js";
import NotificacionesScreen from "../NotificacionesScreen/index.js";

import { createDrawerNavigator } from "react-navigation";
const HomeScreenRouter = createDrawerNavigator(
  {
    Home:     { screen: HomeScreen },
    Noticias: { screen: NewsScreen },
    Foro:     { screen: ForumScreen },
    Empresas: { screen: EmpresasBDScreen },
    Chat:     { screen: MainScreenNavigator },
    Perfil:   { screen: Profile },
    NotificacionesScreen: { screen: NotificacionesScreen},
    Subscripcion: { screen: SubscriptionScreen },
    NoPubliScreen: { screen: NoPubliScreen }
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);


export default HomeScreenRouter;
