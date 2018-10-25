import React, { Component } from "react";
import { Button, Icon, View } from "native-base";
import MyChat from "./MyChat";

import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';

import DropdownAlert from 'react-native-dropdownalert';

export default class ChatScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Chat IEB",
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
      usuario: null,
      loading: true
    };

    this.util = new Utils();
  
    this.analytics = new Analytics();
    this.analytics.trackScreenView("ChatScreen");
  }

  async componentDidMount() {
    this.setState({ loading: true });

    const infoAuth = this.util.getAuthInfo(this);
    const valAu = await infoAuth;
    const infoResult = this.util.getSubscriptionInfo(this);
    const valRes = await infoResult;

    if (this.state.subs_active == "1") {
      if (this.state.usuario != null) {
          this.setState({ loading: false });
        } else {
        this.setState({ loading: false });
        this.onError("Introduce la información de login");
      }
    } else {
      this.setState({ loading: false });
      this.onError("Para acceder al contenido es necesario tener una suscripción activa");
    }
  }

  //Funciones par mostrar alert
  onError = error => {
     if (error) {
       this.dropdown.alertWithType('error', 'Error', error);
     }
  };
  onClose(data) {
     // data = {type, title, message, action}
     // action means how the alert was closed.
     // returns: automatic, programmatic, tap, pan or cancel
     if (data.type == "error") {
       if (this.state.subs_active == "0") {
         this.props.navigation.navigate("SubscriptionScreen");
       } else {
         this.props.navigation.navigate("Profile");
       }
     }
  }

  render() {
    if ((this.state.usuario != null) && (this.state.subs_active == "1")) {
      return <MyChat />;
    } else {
      return (
        <DropdownAlert
          ref={ref => this.dropdown = ref}
          onClose={data => this.onClose(data)} />
      )
    }
  }
}
