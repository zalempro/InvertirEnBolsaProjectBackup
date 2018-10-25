import React from "react";

import { View, ScrollView, Image, Text } from "react-native";
import { Button, Icon } from "native-base";
import { Button as ButtonEle} from "react-native-elements";
import stylesGen from '../Style/styleApp.js';
import DropdownAlert from 'react-native-dropdownalert';
import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';
import AdsComponent from '../Ads/AdsComponent.js';
//import AdsIntersticial from '../Ads/AdsIntersticial.js';
import AdsRewarded from '../Ads/AdsRewarded.js';


export default class NoPubliScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Bonificación",
    headerRight: (
      <Button
        transparent
        onPress={() => navigation.openDrawer()}>
        <Icon name="menu" />
      </Button>
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      subs_active: null
    }

    this.util = new Utils();
    this.analytics = new Analytics();
    this.analytics.trackScreenView("NoPubliScreen");
  }

  async componentDidMount() {
    this.setState({ loading: true });

    const infoAuth = this.util.getAuthInfo(this);
    const valAu = await infoAuth;
    const infoResult = this.util.getSubscriptionInfo(this);
    const valRes = await infoResult;

    this.setState({ loading: false });
  }

  showMessage(strTiempo) {
    this.dropdown.alertWithType('success', strTiempo, "Modo sin distracciones activado");
  }

  render() {
    return (
        <ScrollView style={styles.containerBack}>
          <Image
            resizeMode="contain"
            source={{
              uri: "https://www.invertirenbolsa.info/images/logo.jpg"
            }}
            style={{
              flex: 1,
              width: undefined,
              height: 100,
              alignSelf: "stretch",
              justifyContent: "center",
              alignItems: 'stretch',
              marginTop: 0
            }}>
          </Image>
          <View style={styles.loginZone}>
            <Text style={styles.loginTitle}>BONIFICACIÓN GRATIS</Text>
            <Text style={styles.textPubli}>Hasta 24 horas sin publicidad gratis</Text>
            <Text style={styles.textPubli}>Echa un vistazo a este anuncio para eliminar las distracciones</Text>

            <Text style={styles.textPubli}>Bonificaciones: 30 minutos o 24 horas</Text>
          </View>

          <AdsRewarded
            subs_expiresDateSub={this.state.subs_expiresDateSub}
            onResponseFunction={this.showMessage.bind(this)}
          />

          <AdsComponent
            subscription={this.state.subs_active}
            typeAd={"banner"}
          />
          <DropdownAlert
            ref={ref => this.dropdown = ref}
            closeInterval={30000}
          />
      </ScrollView>

    );
  }
}

const styles = {
  containerBack: {
    backgroundColor: '#FFFFFF',
    paddingLeft: 25,
    paddingRight: 25,
    flex: 1
  },
  containerBackFirst: {
    backgroundColor: '#FFFFFF',
    flex: 1
  },
  loginZone: {
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 0,

  },
  loginTitle: {
    alignItems: 'center',
    fontFamily: 'HelveticaNeue',
    fontSize: 20,
  },
  textPubli: {
    alignItems: 'center',
    //fontFamily: 'HelveticaNeue',
    //fontSize: 20,
    marginTop: 10,
    marginBottom: 20
  }

}
