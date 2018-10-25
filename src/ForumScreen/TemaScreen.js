import React from "react";
import { StatusBar, FlatList, View, ActivityIndicator} from "react-native";
import { Container, Header, Title, Left, Right, Icon, Button, Body, Content,Text, Card, CardItem} from "native-base";

import { getTemasForo } from './ApiForo.js';
import TemaForo from './TemaForo.js';

import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';
import AdsComponent from '../Ads/AdsComponent.js';
import AdsIntersticial from '../Ads/AdsIntersticial.js';
import DropdownAlert from 'react-native-dropdownalert';

//Cargamos stylos
import styles from '../Style/styleApp.js';

export default class TemaScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('titleForo', ''),
    headerLeft: (
      <View>
        <Button transparent
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" IconStyle/>
        </Button>
      </View>
      ),
    headerRight: (
      <View>
        <Button transparent
          onPress={() => navigation.openDrawer()}>
          <Icon name="menu" IconStyle/>
        </Button>
      </View>
    )
  });

  constructor(props) {
    super(props);
    this.temaUrl = this.props.navigation.getParam('temaUrl', '');
    this.state = {
      temasForo: [],
      refreshing: false,
      loading: false,
      paginasTot: 0,
      paginaActual: 1,
      usuario: null
    };

    this.util = new Utils();

    this.analytics = new Analytics();
    this.analytics.trackScreenView("TemaScreen");

    this.fetchTemasForo = this.fetchTemasForo.bind(this);
  }

  // Called after a component is mounted
  async componentDidMount() {
    this.setState({ loading: true });

    const infoAuth = this.util.getAuthInfo(this);
    const valAu = await infoAuth;

    const infoResult = this.util.getSubscriptionInfo(this);
    const valRes = await infoResult;

    this.setState({ loading: false });

    //console.log(this.state.subs_active)
    //if (this.state.subs_active == "1") {
      if (this.state.usuario != null) {
          //console.log("Llamando")
          this.ads = new AdsIntersticial(this.state.subs_active, 6, this);
          this.fetchTemasForo();
        } else {
        this.setState({ loading: false });
        this.onError("Introduce la información de login");
      }
    //} else {
    //  this.setState({ loading: false });
    //  this.onError("Para acceder al contenido es necesario tener una suscripción activa");
    //}
  }

  fetchTemasForo() {
    if (!this.state.loading) {
      this.setState({ loading: true });

      this.analytics.trackEvent("TemaScreen", "Carga temas");

      getTemasForo(
        this.temaUrl,
        this.state.paginasTot,
        this.state.paginaActual,
        this.state.temasForo,
        this.state.usuario,
        this.state.password
      )
        .then(temasForo => this.setState({
          temasForo,
          refreshing: false,
          loading: false,
          paginasTot: Number(temasForo.paginasTot),
          paginaActual: Number(temasForo.paginaActual)
        }))
        .catch(() => this.setState({ refreshing: false, loadling: false }));
      }
  }

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
       () => {
         this.fetchTemasForo();
         this.ads.showIntersticialAd();
       }
      );
  };

  handleLoadMore = () => {
    if (Number(this.state.paginaActual) < Number(this.state.paginasTot)) {
      this.setState(
        {
          paginaActual : Number(this.state.paginaActual) + 1
        }, () => {
          this.fetchTemasForo();
          this.ads.showIntersticialAd();
        });
    }
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
    //  if (this.state.subs_active == "0") {
    //    this.props.navigation.navigate("SubscriptionScreen");
    //  } else {
        this.props.navigation.navigate("Profile");
    //  }
    }
  }

  render() {

    if (this.state.usuario != null) {

      return (
        <Container style={styles.generalContainer}>
            <Button iconLeft block
              onPress={() => this.props.navigation.navigate("NewTemaScreen",{
                entradaUrl: this.props.navigation.getParam('temaUrl', ''),
                titleEntrada: this.props.navigation.getParam('titleForo', '')
              })}
              style={styles2.ButtStyle}
              >
                <Icon name="document"/>
                <Text>Nuevo Tema</Text>
            </Button>
            {this.renderHeader()}
            <FlatList
              removeClippedSubviews
              disableVirtualization
              data={this.state.temasForo.post}
              renderItem={({ item, index, navigation }) => <TemaForo
                showStars={true}
                temaForo={{item, index, nav}}
                adsIntersticial={this.ads}
                subs_active={this.state.subs_active}
                blnOnlyPendingView={false}
              />}
              keyExtractor={item => item.link}
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh.bind(this)}
              onEndReached={this.handleLoadMore.bind(this)}
              initialNumToRender={40}
              maxToRenderPerBatch={10}
              onEndReachedThreshold={0.5}
              extraData={this.state.subs_active}
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

const styles2 = {
  ButtStyle: {
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: 15,
    padding: 0,
    backgroundColor: "#0099ff"
  }
};
