import React, { Component } from "react";
import EmpresasBDScreen from "./EmpresasBDScreen.js";
import DetalleEmpresasScreen from "./DetalleEmpresasScreen.js";
import DatosChartScreen from "./DatosChartScreen.js";
import { createStackNavigator } from "react-navigation";

export default (DrawNav = createStackNavigator({
  EmpresasBDScreen: { screen: EmpresasBDScreen },
  DetalleEmpresasScreen: { screen: DetalleEmpresasScreen},
  DatosChartScreen: {screen: DatosChartScreen}
}));
