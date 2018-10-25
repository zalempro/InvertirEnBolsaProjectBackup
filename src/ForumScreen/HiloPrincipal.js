import React from 'react';
import { View, Linking, TouchableHighlight } from 'react-native';
import { Text, Button, Card, Divider } from 'react-native-elements';
import moment from 'moment';

import stylesGen from '../Style/styleApp.js';

export default class HiloPrincipal extends React.Component {

  render() {
    //console.log(this.props)
    const index = this.props.hiloPrincipal.index;
    const nav = this.props.hiloPrincipal.nav;
    const imagesForo = {
      0: require('../../images/foroIndex_1.jpg'),
      1: require('../../images/foroIndex_2.jpg'),
      2: require('../../images/foroIndex_3.jpg'),
      3: require('../../images/foroIndex_4.jpg'),
      4: require('../../images/foroIndex_5.jpg'),
      5: require('../../images/foroIndex_6.jpg'),
      6: require('../../images/foroIndex_7.jpg'),
      7: require('../../images/foroIndex_8.jpg'),
      8: require('../../images/foroIndex_9.jpg'),
      9: require('../../images/foroIndex_10.jpg'),
      10: require('../../images/foroIndex_11.jpg'),
      11: require('../../images/foroIndex_12.jpg'),
      12: require('../../images/foroIndex_13.jpg'),
      13: require('../../images/foroIndex_14.jpg'),
      14: require('../../images/foroIndex_15.jpg'),
      15: require('../../images/foroIndex_16.jpg'),
    }


    const {
      title,
      descripcion,
      link,
      temas,
      mensajes,
      ultimopost,
      ultimopostby
    } = this.props.hiloPrincipal.item;
    const { noteStyle, featuredTitleStyle } = styles;
    const defaultImg = require('../../images/foroIndex_0.jpg');

    if (index > 15) {
      imgItem = defaultImg;
    } else {
      imgItem = imagesForo[index];
    }
    return (
      <TouchableHighlight
         //onPress={() => Linking.openURL(link)}
         onPress={() => nav.navigate("TemaScreen",{
           temaUrl: link,
           titleForo: title
         })}
        >
        <Card
          featuredTitle={title}
          featuredTitleStyle={featuredTitleStyle}
          containerStyle={stylesGen.cardGeneral}
          image={imgItem}
        >
          <Text>{descripcion}</Text>
          <Divider style={styles.divider}/>
          <Text>Último post: {ultimopost} by {ultimopostby}</Text>
          <Divider style={styles.divider}/>
          <View style={styles.stadistic}>
            <Text style={styles.temas}>{temas}</Text>
            <Text style={styles.mensajes}>{mensajes}</Text>
          </View>
        </Card>
      </TouchableHighlight>
    );
  }
}

const styles = {
  featuredTitleStyle: {
    marginHorizontal: 5,
  },
  stadistic : {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  temas: {
    //textAlign : 'Left'
  },
  mensajes: {
    alignItems: 'flex-end',
    //textAlign : 'Right'
  },
  divider: {
    marginTop: 5,
    marginBottom: 5
  }
};
