import React from "react";

import { View, ScrollView, Image, Text, ActivityIndicator, Platform } from "react-native";
import { Button, Icon } from "native-base";
import { List, ListItem} from "react-native-elements";
import stylesGen from '../Style/styleApp.js';
import { getSuscripcionListUser } from './ApiSubscripcionForo.js';
import DropdownAlert from 'react-native-dropdownalert';
import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';
import AdsComponent from '../Ads/AdsComponent.js';


export default class SubscripcionForoScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Suscripciones Foro",
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
      subscripciones: null,
      loading: true
    };

    this.util = new Utils();

    this.analytics = new Analytics();
    this.analytics.trackScreenView("SuscripcionesForoScreen");
  }

  async componentDidMount() {
    this.setState({ loading: true });

    const infoAuth = this.util.getAuthInfo(this);
    const valAu = await infoAuth;

    const infoResult = this.util.getSubscriptionInfo(this);
    const valRes = await infoResult;

    if  ((this.state.usuario != null) && (this.state.password != null)) {
      this.fetchSubscripcionListUser();
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

  fetchSubscripcionListUser() {
    if (!this.state.loading) {
      this.setState({ loading: true });
    }

    getSuscripcionListUser(
      this.state.usuario,
      this.state.password
    )
      .then(subscripciones => this.setState({
        subscripciones,
        refreshing: false,
        loading: false
      }))
      .catch(() => this.setState({ refreshing: false, loading: false }));

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

  renderItems() {
    //console.log("manu:", this.state.subscripciones)
    if (this.state.subscripciones) {
      return (
         <React.Fragment>
            {this.state.subscripciones.suscripcionesUser.map(r =>
              <ListItem
                switchButton
                //switched={this.state.blnRecibirNotificaciones}
                title={r.title}
                onPress={() => {
                    nav.navigate("DetSubscripcionForoScreen",{
                      subsUrl: r.link,
                      titleSubs: r.title
                    }
                  )}}
              />
            )}
         </React.Fragment>
     );
   } else {
     return null;
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
          <Text style={styles.loginTitle}>Suscripciones Foro</Text>
        </View>

        {this.renderActivityMonitor()}

        <List>
          {this.renderItems()}
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
