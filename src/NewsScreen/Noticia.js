import React from 'react';
import { View, Linking, TouchableHighlight } from 'react-native';
import { Text, Button, Card, Divider } from 'react-native-elements';
import moment from 'moment';

import styles from '../Style/styleApp.js';


export default class Noticia extends React.Component {

  render() {
    const {
      fecha,
      title,
      link,
      empresa
    } = this.props.noticia.item;

    const wtf8 = require('wtf-8');
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    decode = require('decode-html');


    const { noteStyle } = styles;

    return (

      <TouchableHighlight
         key={link}
         onPress={() => {
           Linking.openURL(decode(entities.decode(wtf8.decode(link))))
         }}
        >
        <Card containerStyle={styles.cardGeneral}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <Text style={noteStyle}>{decode(entities.decode(wtf8.decode(fecha)))}</Text>
            <Text style={noteStyle}>{decode(entities.decode(wtf8.decode(empresa)))}</Text>
          </View>
          <Divider  />
          <Text style={noteStyle}>{decode(entities.decode(wtf8.decode(title)))}</Text>
        </Card>
      </TouchableHighlight>
    );
  }
}
