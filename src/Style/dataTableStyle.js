
/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2016
 */

import {
  Dimensions, StyleSheet
} from 'react-native';

import {
  BACKGROUND_COLOR,
  BLUE_WHITE,
  LIGHT_GREY,
  WARM_GREY,
  DARK_GREY,
  SUSSOL_ORANGE,
  SHADOW_BORDER,
  GRIS_CLARO,
  GRIS_SUAVE,
  ROW_DT_PAR,
  ROW_DT_IMPAR
} from './colors';
import { APP_FONT_FAMILY } from './fonts';

export const dataTableColors = {
  checkableCellDisabled: LIGHT_GREY,
  checkableCellChecked: SUSSOL_ORANGE,
  checkableCellUnchecked: WARM_GREY,
  editableCellUnderline: WARM_GREY,
};

export default StyleSheet.create({
//export const dataTableStyles = {
  container: {
    margin: 10,
    flex: 1,
    width: 1000,
    //horitzontal: true,
    borderWidth: 1,
    borderColor: SHADOW_BORDER,
    backgroundColor: GRIS_CLARO,
  },
  text: {
    //fontFamily: APP_FONT_FAMILY,
    //fontSize: Dimensions.get('window').width / 100,
    fontSize: 14,
    color: DARK_GREY,
  },
  header: {
    backgroundColor: 'white',
  },
  headerCell: {
    height: 40,
    borderWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: 'white',
    borderColor: GRIS_SUAVE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    backgroundColor: BACKGROUND_COLOR,
  },
  rowPar: {
    backgroundColor: ROW_DT_PAR,
  },
  rowImpar: {
    backgroundColor: ROW_DT_IMPAR,
  },
  expansion: {
    padding: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BLUE_WHITE,
  },
  expansionWithInnerPage: {
    padding: 2,
    paddingBottom: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BLUE_WHITE,
  },
  cell: {
    padding: 0,
    borderWidth: 1,
    borderColor: GRIS_SUAVE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightMostCell: {
    borderRightWidth: 0,
  },
  checkableCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    borderWidth: 1,
    borderRadius: 4,
    padding: 15,
    margin: 5,
    borderColor: SUSSOL_ORANGE,
  },
  button2: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,

  },
  button3: {
    //flex:1,
    //alignItems: 'flex-start',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    //borderWidth: 1.0
  },
});
