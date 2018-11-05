import React from 'react';
import { View, Linking, TouchableHighlight, Image, WebView, Dimensions, Alert } from 'react-native';
import { Text, Button, Card, Divider } from 'react-native-elements';
import moment from 'moment';

import Hyperlink from 'react-native-hyperlink';
import StarRatingBar from 'react-native-star-rating-view/StarRatingBar';
import Utils from '../Utils/Utils.js';
import stylesGen from '../Style/styleApp.js';

import HTML from 'react-native-render-html';
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';

export default class EntradaForo extends React.PureComponent {

  constructor(props) {
      super(props);
      this.state = { strComp: "<Text>5test6</Text>", webViewHeight: 100 }
      this.util = new Utils();
      this.isCancelled = false;
  }

  componentWillUnmount() {
      this.isCancelled = true;
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

  convertToText = (response, blnInit, blnFin) => {
    //const wtf8 = require('wtf-8');
    //const Entities = require('html-entities').AllHtmlEntities;
    //const entities = new Entities();

    var returnValue = [];
    var i = 0;
    var j = 0;
    //var newComp = null;
    var RandomNumber = Math.floor(Math.random() * 1000) + 1 ;
    var arrText = response.split("==inicio_cita==")
    if (arrText.length == 1) {
      var arrFin = arrText[0].split("==fin_cita==")
      if (arrFin.length == 1) {
        if (arrFin[0].length > 0) {
          //var textMsg = decode(entities.decode(wtf8.decode(arrFin[0])));
          var textMsg = this.util.decodeData(arrFin[0]);

          textMsg = textMsg.replace("==init_autor==", "")
          textMsg = textMsg.replace("==fin_autor==", "\n\n")
          textMsg = textMsg.trim();

          if (blnInit && blnFin) {
            returnValue.push(
              <Hyperlink
                key={RandomNumber}
                linkStyle={styles.linkText}
                linkDefault={ true }>
                <Text style={styles.citaBloc}>{textMsg}</Text>
              </Hyperlink>
            )
          } else {
            returnValue.push(
              <Hyperlink key={RandomNumber}
                linkStyle={styles.linkText}
                linkDefault={ true }>
                <Text style={styles.textNormal}>{textMsg}</Text>
              </Hyperlink>
            )
          }
        }
      } else {
         for (i==0; i < arrFin.length; i++){
           if(i % 2 == 0){
             blnFin = true;
           } else {
             blnFin = false;
           }
           returnValue.push(this.convertToText(arrFin[i], blnInit, blnFin))
         }
      }
    } else {

      for (j==0; j < arrText.length; j++){
        if (j>0){
          blnInit = true;
        }
        returnValue.push(this.convertToText(arrText[j], blnInit, blnFin))
      }
    }
    return returnValue
  }

  renderTitlePost = (posttitle) => {
    if (posttitle != "") {
      return (
        <Text style={styles.postTitle}>{this.util.decodeData(this.util.decodeData(posttitle))}</Text>
      );
    }
  }


/*  _updateWebViewHeight = (event) => {
      !this.isCancelled && this.setState({webViewHeight: parseInt(event.jsEvaluationValue)});
  } */

  render()  {
    const index = this.props.entradaForo.index;
    const nav = this.props.nav;
    //console.log("manu:", this.props)

    const {
      isNew,
      postDate,
      posttitle,
      numPost,
      userPost,
      userPostUrl,
      userPostAvatar,
      userDateAlta,
      userMensajes,
      postContent,
      report
    } = this.props.entradaForo.item;

    const { noteStyle, featuredTitleStyle, featuredSubtitleStyle } = styles;

    //decode = require('decode-html');

    let Image_Http_URL = { uri: userPostAvatar};
    let strPost = this.convertToText(postContent, false, false);

    let textComent = this.util.decodeData(postContent);

    //Para mostrar solo los pendientes de leer en Posts nuevos
    if (!this.props.blnOnlyPendingView) {
      blnMostrar = true;
    } else if (this.props.blnOnlyPendingView && isNew) {
      blnMostrar = true;
    } else {
      //console.log("blnCargaInicial",this.props.blnCargaInicial)
      if (this.props.blnCargaInicial) {
        blnMostrar = false;
      } else {
        blnMostrar = true;
      }
    }
    if (blnMostrar) {
      return (
        <React.Fragment>
          <TouchableHighlight
            key={this.util.uuidv4()}
            >
            <Card
              key={this.util.uuidv4()}
              containerStyle={stylesGen.cardGeneral}
              >
              <View style={styles.stadistic}>
                <Text style={styles.temas}>{numPost}</Text>
                <Text style={styles.mensajes}>{this.util.decodeData(postDate)}</Text>
              </View>
              <Divider style={styles.divider}/>

              <View style={styles.stadistic}>
                {userPostAvatar != '' ? <Image source={Image_Http_URL}
                  style={{
                    alignSelf: 'center',
                    height: 30,
                    width: 30,
                    borderWidth: 0.5,
                    borderRadius: 15
                  }}
                  resizeMode="cover"
                /> : <Text style={styles.temas}></Text>}
                <Text style={styles.mensajes}>Alta: {this.util.decodeData(userDateAlta)}</Text>
              </View>
              <View style={styles.stadistic}>
                <Text style={styles.temas}>{userPost}</Text>
                <Text style={styles.mensajes}>Mensajes: {this.util.decodeData(userMensajes)}</Text>
              </View>
              <Divider style={styles.divider}/>
              {this.renderTitlePost(posttitle)}
              <View style={{flex: 1, flexDirection:'column'}}>
                <HTML
                  key={this.util.uuidv4()}
                  html={textComent}
                  navComponent={nav}
                  nameNavScreen={"ImageScreen"}
                  imagesMaxWidth={Dimensions.get('window').width-60}
                  ignoredTags={[ ...IGNORED_TAGS, 'font', 'fontFamily']}
                  onLinkPress={(evt, href) => { Linking.openURL(href)}}
                  classesStyles={{
                          'bbcode_quote': {
                            borderWidth: 2,
                            borderColor: '#ffd866',
                            borderRadius: 15,
                            backgroundColor: '#fcf0cc',
                            padding: 10,
                            overflow: 'hidden',
                            marginTop: 10,
                            marginBottom: 10
                          },
                          'bbcode_postedby': {
                            flex: 1,
                            flexDirection: 'row',
                            marginBottom: 10
                          },
                          'inlineimg': {
                            marginLeft: 5
                          }
                        }}
                />
              </View>
              <Divider style={styles.divider}/>
              <Button
                onPress={() => { nav.navigate("ReportScreen",
                  {
                    posttitle: numPost,
                    report: report,
                   }) }}
                title="Denunciar mensaje"
                backgroundColor="#FFFFFF"
                color="blue"
              />
            </Card>
          </TouchableHighlight>
          {this.renderNoPubliButton(index)}
        </React.Fragment>
      );
    } else {
      return null;
    }
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom:5
  },
  temas: {
    //textAlign : 'Left',
    fontWeight: 'bold'
  },
  mensajes: {
    alignItems: 'flex-end',
    //textAlign : 'Right',
    justifyContent: 'center',
    alignItems: 'center'
  },
  divider: {
    marginTop: 5,
    marginBottom: 5
  },
  citaBloc: {
    borderWidth: 2,
    borderColor: '#ffd866',
    borderRadius: 15,
    backgroundColor: '#fcf0cc',
    padding: 10,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 10
  },
  textNormal: {
    //borderWidth: 2,
    //borderColor: '#2170ef',
    //borderRadius: 15,
    backgroundColor: 'white',
    padding: 0,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 10
  },
  linkText: {
    color: '#2980b9',
    fontSize: 14
  },
  postTitle: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center'
  }
};
