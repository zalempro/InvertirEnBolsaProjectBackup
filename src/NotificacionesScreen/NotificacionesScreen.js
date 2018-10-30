import React from "react";

import { View, ScrollView, Image, Text, ActivityIndicator, Platform } from "react-native";
import { Button, Icon } from "native-base";
import { List, ListItem} from "react-native-elements";
import stylesGen from '../Style/styleApp.js';
import {
  activarNotificaciones,
  activarNotificacionesMisPosts,
  inicializaNotificaciones} from './ApiNotificaciones.js';
import OneSignal from 'react-native-onesignal';
import DropdownAlert from 'react-native-dropdownalert';
import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';
import AdsComponent from '../Ads/AdsComponent.js';

export default class NotificacionesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Notificaciones",
    headerRight: (
      <View>
        <Button
          transparent
          onPress={() => navigation.openDrawer()}>
          <Icon name="menu" />
        </Button>
      </View>
    )
  });


  constructor(props) {
    super(props);

    this.state = {
      usuario: '',
      password: '',
      blnRecibirNotificaciones: false,
      blnRecibirNotificacionesMisPosts: false,
      loading: true
    };

    this.util = new Utils();

    this.analytics = new Analytics();
    this.analytics.trackScreenView("NotificacionesScreen");
  }

  async componentDidMount() {
    this.setState({ loading: true });

    const infoAuth = this.util.getAuthInfo(this);
    const valAu = await infoAuth;

    const infoResult = this.util.getSubscriptionInfo(this);
    const valRes = await infoResult;

    if  ((this.state.usuario != null) && (this.state.password != null)) {
      OneSignal.getPermissionSubscriptionState((status) => {
          this.setState({ userIdToken: status.userId });
          inicializaNotificaciones(
            this.state.usuario, this.state.password, status.userId, Platform.OS
          )
          .then(blnResult => {
            if (blnResult) {
                this.setState({
                  blnRecibirNotificaciones: blnResult.notificationes_activa,
                  blnRecibirNotificacionesMisPosts: blnResult.notificationes_mis_posts
                });
            }
          });
      });
    }

    this.setState({ loading: false });
  }


  //Funciones par mostrar alert
  onError = error => {
    if (error) {
      this.dropdown.alertWithType('error', 'Error', error);
    }
  };
  onSuccess = success => {
    if (success) {
      this.dropdown.alertWithType('success', 'OK', success);
    }
  };
  onClose(data) {
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
    if (data.type == "success") {
      this.props.navigation.navigate("Foro");
    }
  }

  renderActivityMonitor() {
    if (this.state.loading) {
        return(
          <ActivityIndicator style={stylesGen.ActivityIndicator} animating size="large" />
        );
    } else {
      return null;
    }
  }

  recibirNotificaciones(blnValue) {
    //console.log("hola!!", strValue)

    if  ((this.state.usuario != null) && (this.state.password != null)) {
      OneSignal.getPermissionSubscriptionState((status) => {
          //console.log("status:",status)
          this.setState({ userIdToken: status.userId });
          activarNotificaciones(
            this.state.usuario, this.state.password, blnValue, status.userId, Platform.OS
          )
          .then(blnResult => {
            if (blnResult) {
                this.setState({blnRecibirNotificaciones: blnValue});
            }
          });
      });
    }
  }


  recibirNotificacionesMisPosts(blnValue) {
    if  ((this.state.usuario != null) && (this.state.password != null)) {
      OneSignal.getPermissionSubscriptionState((status) => {
          //console.log("status:",status)
          this.setState({ userIdToken: status.userId });
          activarNotificacionesMisPosts(
            this.state.usuario, this.state.password, blnValue, status.userId, Platform.OS
          )
          .then(blnResult => {
            if (blnResult) {
                this.setState({blnRecibirNotificacionesMisPosts: blnValue});
            }
          });
      });
    }
  }

  render() {
    let { usuario, password, errors = {} } = this.state;

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
          <Text style={styles.loginTitle}>Configurar Notificaciones</Text>
        </View>

        {this.renderActivityMonitor()}

        <List>
          <ListItem
            switchButton
            hideChevron
            switched={this.state.blnRecibirNotificaciones}
            title="Notificaciones hilos favoritos"
            onSwitch={(value) => { this.recibirNotificaciones(value) }}
          />
          <ListItem
            switchButton
            hideChevron
            switched={this.state.blnRecibirNotificacionesMisPosts}
            title="Notificaciones en mis hilos"
            onSwitch={(value) => { this.recibirNotificacionesMisPosts(value) }}
          />
        </List>

        <AdsComponent
          subscription={this.state.subs_active}
          typeAd={"banner"}
        />
        <DropdownAlert
          ref={ref => this.dropdown = ref}
          onClose={data => this.onClose(data)} />
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
  loginZone: {
    alignSelf: "stretch",
    //justifyContent: "center",
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 25,

  },
  loginTitle: {
    alignItems: 'center',
    fontSize: 20,
  }
}
