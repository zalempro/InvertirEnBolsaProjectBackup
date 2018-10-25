import React from "react";
import { StatusBar, FlatList, View, ActivityIndicator} from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem} from "native-base";

import { getHilosPrincipales } from './ApiForo.js';
import HiloPrincipal from './HiloPrincipal.js';
import DropdownAlert from 'react-native-dropdownalert';

import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';
import AdsComponent from '../Ads/AdsComponent.js';
import AdsIntersticial from '../Ads/AdsIntersticial.js';

//Cargamos stylos
import styles from '../Style/styleApp.js';

export default class ForumScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Foro de inversiones",
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
        hilosPrincipales: [],
        refreshing: false,
        loading: false,
        usuario: null
      };

      this.util = new Utils();

      this.analytics = new Analytics();
      this.analytics.trackScreenView("ForumScreen");

      this.fetchHilosPrincipales = this.fetchHilosPrincipales.bind(this);
    }
    // Called after a component is mounted
    async componentDidMount() {
      this.setState({ loading: true });

      const infoAuth = this.util.getAuthInfo(this);
      const valAu = await infoAuth;

      const infoResult = this.util.getSubscriptionInfo(this);
      const valRes = await infoResult;

      //console.log(this.state.subs_active)
      //if (this.state.subs_active == "1") {
        if (this.state.usuario != null) {
            this.ads = new AdsIntersticial(this.state.subs_active, 5, this);
            this.fetchHilosPrincipales();
          } else {
          this.setState({ loading: false });
          this.onError("Introduce la información de login");
        }
      //} else {
      //  this.setState({ loading: false });
      //  this.onError("Para acceder al contenido es necesario tener una suscripción activa");
      //}
     }

    async fetchHilosPrincipales() {
      this.setState({ loading: true });

      this.analytics.trackEvent("ForumScreen", "Carga foro Principal");

      const promise = getHilosPrincipales(this.state.usuario, this.state.password)
        .then(hilosPrincipales => this.setState({ hilosPrincipales, refreshing: false, loading: false }))
        .catch(() => this.setState({ refreshing: false, loadling: false }));
      const asd = await promise;
    }

    handleRefresh = () => {

      this.setState(
        {
          refreshing: true
        },
         () => {
           this.fetchHilosPrincipales();
           this.ads.showIntersticialAd();
         }
        );
    };

    renderHeader =() => {

      if ((!this.state.loading) || (this.state.loading && this.state.refreshing)) return null;

      return (
        <ActivityIndicator style={styles.ActivityIndicator} animating size="large" />
      );
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
      //if (this.state.subs_active == "0") {
      //  this.props.navigation.navigate("SubscriptionScreen");
      //} else {
        this.props.navigation.navigate("Profile");
      //}
    }
  }

  render() {
    nav = this.props.navigation;


    if (this.state.usuario != null) {
      return (
        <Container style={styles.generalContainer}>
            {this.renderHeader()}
            <FlatList
              data={this.state.hilosPrincipales}
              renderItem={({ item, index, navigation}) => <HiloPrincipal hiloPrincipal={{item, index, nav}} />}
              keyExtractor={item => item.link}
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh.bind(this)}
            />
            <AdsComponent
              subscription={this.state.subs_active}
              typeAd={"banner"}
            />
        </Container>
      );
    } else {
      return (
        <Container style={styles.generalContainer}>
          {this.renderHeader()}
          <AdsComponent
            subscription={this.state.subs_active}
            typeAd={"banner"}
          />
          <DropdownAlert
            ref={ref => this.dropdown = ref}
            onClose={data => this.onClose(data)} />
        </Container>
      )
    }
  }
}
