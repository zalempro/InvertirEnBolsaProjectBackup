import React from "react";
import { AppRegistry, Image, StatusBar, View, Dimensions, Platform } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";
import FullWidthImage from 'react-native-fullwidth-image';
//import { StackActions, NavigationActions } from 'react-navigation';



export default class SideBar extends React.Component {



  state = {
      imgWidth: 0,
      imgHeight: 0,
    }

  componentDidMount() {
    const logoImg = require('../../images/logo_ieb.jpg');

    const screenWidth = (Dimensions.get('window').width / 3) * 2;
    width = Image.resolveAssetSource(logoImg).width;
    height = Image.resolveAssetSource(logoImg).height;

    const scaleFactor = width / screenWidth
    const imageHeight = height / scaleFactor
    this.setState({imgWidth: screenWidth, imgHeight: imageHeight})
  }

  render() {

    if ((process.env.NODE_ENV === 'development') || (Platform.OS==="ios")) {
      var routes = [
        ["Home","Posts nuevos"],
        ["SubscripcionForo","Suscripciones Foro"],
        ["Noticias","Noticias"],
        ["Foro","Foro"],
        ["Empresas","Empresas"],
        ["Perfil","Perfil"],
        ["NotificacionesScreen","Notificaciones"],
        ["Subscripcion","Suscripción App"],
        ["NoPubliScreen", "Eliminar Publicidad - GRATIS"],
        ["ContactoScreen", "Contacto"]
      ];
    }  else {
      var routes = [
        ["Home","Posts nuevos"],
        ["SubscripcionForo","Suscripciones Foro"],
        ["Noticias","Noticias"],
        ["Foro","Foro"],
        ["Empresas","Empresas"],
        ["NotificacionesScreen","Notificaciones"],
        ["Perfil","Perfil"],
        ["NoPubliScreen", "Eliminar Publicidad - GRATIS"],
        ["ContactoScreen", "Contacto"]
      ];
    }

    const logoImg = require('../../images/logo_ieb.jpg');
    const {imgWidth, imgHeight} = this.state;
    //console.log(this.props.navigation)

    return (
      <Container>
        <Content>

            <FullWidthImage
              style={{marginTop: 50}}
              width={imgWidth}
              height={imgHeight}
              source={logoImg}
            />
          <List
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem
                  button
                  onPress={() => this.props.navigation.navigate(data[0])}>
                  <Text>{data[1]}</Text>
                </ListItem>
              );
            }}
          />
        </Content>
      </Container>
    );
  }
}
