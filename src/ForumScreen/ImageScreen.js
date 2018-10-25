import React from "react";

import { View, Image, Modal, Dimensions } from "react-native";
import { Button, Icon } from "native-base";

import stylesGen from '../Style/styleApp.js';
import Gallery from 'react-native-image-gallery';


import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';



export default class ImageScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Visor Imagen",
    headerRight: (
      <Button
        transparent
        onPress={() => navigation.goBack()}>
        <Icon name="menu" />
      </Button>
    )
  });

  constructor(props) {
    super(props);

    this.urlImage = this.props.navigation.getParam('urlImage', '');
    //console.log(this.urlImage)

    this.util = new Utils();

    this.analytics = new Analytics();
    this.analytics.trackScreenView("ImageScreen");

  }



  componentDidMount() {
    var util = new Utils();
    util.getKey("AuthIEB","usuario", this);
    util.getKey("AuthIEB","password", this);

  }

  render() {
    return (
      <Gallery
        style={{ flex: 1, backgroundColor: 'black' }}
        images={[
          { source: { uri: this.urlImage } }
        ]}
      />
    )

  }
}
