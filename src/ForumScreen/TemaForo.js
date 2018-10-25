import React from 'react';
import { View, Linking, TouchableHighlight } from 'react-native';
import { Text, Button, Card, Divider } from 'react-native-elements';
import moment from 'moment';

import StarRatingBar from 'react-native-star-rating-view/StarRatingBar';
import Utils from '../Utils/Utils.js';

import stylesGen from '../Style/styleApp.js';

export default class TemaForo extends React.Component {

  constructor(props) {
      super(props);
      this.util = new Utils();
  }

  renderStars(calificacion) {
    if (this.props.showStars) {
      /*return (
        <View style={styles.temas}>
          <StarRatingBar
              score={calificacion}
              dontShowScore={true} // true: not show the score text view
              allowsHalfStars={false}
              accurateHalfStars={false}
          />
        </View>
      );*/
      return null;
    } else {
      return null;
    }
  }

  renderNoPubliButton(eleIndex) {
    if ((this.props.subs_active != "1") && (eleIndex % 2 == 0 )) {
      return (
        <Button
          leftIcon={{name: 'subscriptions'}}
          title='Eliminar Publicidad GRATIS'
          buttonStyle={{
            backgroundColor: "#0099ff",
            flex: 1,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5,
            marginTop: 25,
            marginBottom: 10
          }}
            onPress={() => { nav.navigate("NoPubliScreen") }}
          />
      );
    } else {
      return (null);
    }
  }

  render() {
    //console.log(this.props)
    const index = this.props.temaForo.index;
    //console.log("TemaForo index: ", index)

    const nav = this.props.temaForo.nav;

    //console.log(this.props.temaForo)

    const {
      title,
      link,
      adherido,
      createUser,
      createUSerUrl,
      paginasTema,
      respuestas,
      visitas,
      calificacion,
      lastUserPost,
      lastUserPostUrl,
      lastPostDate
    } = this.props.temaForo.item;
    const { noteStyle, featuredTitleStyle, featuredSubtitleStyle } = styles;

    const defaultImg = require('../../images/foroIndex_0.jpg');

    //const wtf8 = require('wtf-8');
    //const Entities = require('html-entities').AllHtmlEntities;
    //const entities = new Entities();
    //decode = require('decode-html');

    imgItem = defaultImg;

    strAdherido = '';
    if (adherido == '1') {
      strAdherido = '[Adherido] '
    }

    if (index>20 && adherido == '1') {
      return(null);
    }

      return (
        <React.Fragment>

          <TouchableHighlight
              key={this.util.uuidv4()}
              onPress={() => {
                  nav.navigate("EntradaScreen",{
                    entradaUrl: link,
                    paginasTema: paginasTema,
                    titleTema: this.util.decodeData(this.util.decodeData(title)),
                    refreshFunction: this.props.onBackRefresh,
                    indexTema: title + '-' + lastPostDate,
                    blnOnlyPendingView: this.props.blnOnlyPendingView
                  }
                )
                  this.props.adsIntersticial.showIntersticialAd();
                }
              }
            >
            <Card
              key={this.util.uuidv4()}
              containerStyle={stylesGen.cardGeneral}
              >
              <Text style={styles.title}>{strAdherido}{this.util.decodeData(this.util.decodeData(title))}</Text>
              <Divider style={styles.divider}/>
              <View style={styles.stadistic}>
                {this.renderStars(calificacion)}
                <Text style={styles.mensajes}>Creador: {this.util.decodeData(this.util.decodeData(createUser))}</Text>
              </View>
              <Divider style={styles.divider}/>
              <Text>Últ. mensaje: {lastPostDate} por '{this.util.decodeData(this.util.decodeData(lastUserPost))}'</Text>
              <Divider style={styles.divider}/>
              <View style={styles.stadistic}>
                <Text style={styles.temas}>Respuestas: {respuestas}</Text>
                <Text style={styles.mensajes}>Visitas: {visitas}</Text>
              </View>
            </Card>
          </TouchableHighlight>
          {this.renderNoPubliButton(index)}
        </React.Fragment>
      );

  }
}

const styles = {
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  noteStyle: {
    margin: 5,
    fontStyle: 'italic',
    color: '#b2bec3',
    fontSize: 10
  },
  featuredTitleStyle: {
    margin: 10,
    position: 'absolute',
    top: 0,
    //textShadowColor: '#00000f'
    //textShadowOffset: { width: 3, height: 3 },
    //textShadowRadius: 3
  },
  featuredSubtitleStyle: {
    margin:10,
    position: 'absolute',
    bottom: 0,
    right: 0
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
