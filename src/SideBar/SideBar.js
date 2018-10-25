import React from "react";
import { AppRegistry, Image, StatusBar, View, Dimensions, Platform } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";
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

    if(process.env.NODE_ENV === 'development') {
      var routes = [
        ["Home","Posts nuevos"],
        ["Noticias","Noticias"],
        ["Foro","Foro"],
        ["Empresas","Empresas"],
        ["Perfil","Perfil"],
        ["NotificacionesScreen","Notificaciones"],
        ["Subscripcion","Suscripción"],
        ["NoPubliScreen", "Eliminar Publicidad - GRATIS"]
      ];
    }  else {
      var routes = [
        ["Home","Posts nuevos"],
        ["Noticias","Noticias"],
        ["Foro","Foro"],
        ["Empresas","Empresas"],
        ["NotificacionesScreen","Notificaciones"],
        ["Perfil","Perfil"],
        ["NoPubliScreen", "Eliminar Publicidad - GRATIS"]
      ];
    }

    const logoImg = require('../../images/logo_ieb.jpg');
    const {imgWidth, imgHeight} = this.state;
    //console.log(this.props.navigation)

    return (
      <Container>
        <Content>
            <Image
              style={{width: imgWidth, height: imgHeight, marginTop: 50}}
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
