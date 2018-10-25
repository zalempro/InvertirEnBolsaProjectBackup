//stylos Globalos

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  headerStyle: {
    padding: 0
  },
  titleNavStyle: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftNavStyle: {
    //leftDrawerWidth: 10,
    borderWidth: 0.5
  },
  generalContainer: {
    backgroundColor: "#f2f2f2",
  },
  genView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#f2f2f2",
  },
  cardGeneral: {
    shadowOffset:{
      width: 1,
      height: 1,
    },
    shadowColor: '#999999',
    shadowOpacity: 0.5,
    overflow: 'hidden'
  },
  noteStyle: {
    paddingTop: 5,
    paddingBottom: 5,
    //fontStyle: 'italic',
    //color: '#b2bec3',
    fontSize: 14
  },

  viewCard : {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom:5,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  textViewCardIzq: {
    flex: 1
    //textAlign : 'Left',
  },
  textViewCardDer: {
    flex: 1,
    //alignItems: 'flex-end',
    //textAlign : 'Right',
    //justifyContent: 'center',
    //alignItems: 'center',
    fontWeight: 'bold',
    textAlign: 'center',
    //borderWidth: 1
    //width: 125
  },
  featuredTitleStyle: {
    marginHorizontal: 5,
  },
  divider: {
    marginTop: 5,
    marginBottom: 5
  },
  titleGraf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 10
  },
  titleObs: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 5
  },
  textObs: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    padding: 5
  },
  ActivityIndicator: {
    paddingTop: 25
  },
  ActivityIndicator2: {
    marginTop: 25,
    marginBottom: 25
  },
});
