import React from "react";

import { StatusBar, FlatList, View, ActivityIndicator, Platform, AppState } from "react-native";
import { Container, Header, Title, Left, Right, Icon, Button, Body, Content,Text, Card, CardItem} from "native-base";

import { getSuscripcionListUserPost } from './ApiSubscripcionForo.js';

import TemaForo from '../ForumScreen/TemaForo.js';

import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';
import AdsIntersticial from '../Ads/AdsIntersticial.js';
import DropdownAlert from 'react-native-dropdownalert';
import AdsComponent from '../Ads/AdsComponent.js';

//Cargamos stylos
import styles from '../Style/styleApp.js';

export default class DetSubscripcionForoScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('titleSubs'),
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
      temasForo: [],
      refreshing: false,
      loading: false,
      usuario: null,
      appState: AppState.currentState,
      subsUrl: this.props.navigation.getParam('subsUrl')
    };

    this.util = new Utils();

    this.analytics = new Analytics();
    this.analytics.trackScreenView("DetSubscripcionForoScreen");

    this.fetchSubscriptionForo = this.fetchSubscriptionForo.bind(this);
  }

  // Called after a component is mounted
  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    this.isCancelled = false;
    !this.isCancelled && this.setState({ loading: true });

    const infoAuth = this.util.getAuthInfo(this);
    const valAu = await infoAuth;

    const infoResult = this.util.getSubscriptionInfo(this);
    const valRes = await infoResult;

    !this.isCancelled && this.setState({ loading: false });

    if (this.state.usuario != null) {
        this.fetchSubscriptionForo();

        this.ads = new AdsIntersticial(this.state.subs_active, 5, this);
      } else {
      this.setState({ loading: false });
      this.onError("Introduce la información de login");
      this.props.navigation.navigate("Profile");
    }


  }

  componentWillUnmount() {
      this.isCancelled = true;
      AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/background/) && nextAppState === 'active') {
      this.handleRefresh();
    }
    this.setState({appState: nextAppState});
  }


  fetchSubscriptionForo() {
    if (!this.state.loading) {
      !this.isCancelled && this.setState({ loading: true });

      this.analytics.trackEvent("DetSubscripcionForoScreen", "Carga subscripciones");

      getSuscripcionListUserPost(
        this.state.usuario,
        this.state.password,
        this.state.subsUrl,
        this.state.temasForo
      )
      .then(temasForo => this.setState({
        temasForo,
        refreshing: false,
        loading: false
      }))
      .catch(() => { !this.isCancelled && this.setState({ refreshing: false, loadling: false })});

    }
  }

 handleRefresh = async () => {
    !this.isCancelled && this.setState(
      {
        refreshing: true
      },
       () => {
         this.fetchSubscriptionForo();
         this.ads.showIntersticialAd();
       }
      );

  };

  returnRefresh = (indexValueStr) => {

  };



  renderHeader =() => {
    if ((!this.state.loading) || (this.state.loading && this.state.refreshing)) return null;

    return (
      <ActivityIndicator style={styles.ActivityIndicator2} animating size="large" />
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
    //    this.props.navigation.navigate("Profile");
    //  }
    }
  }



  render() {

    nav = this.props.navigation;
    //console.log("Renderizo")

    if (this.state.usuario != null) {

      if (this.state.temasForo == null) {
        return (
          <Container style={styles.generalContainer}>
            {this.renderHeader()}
            <View style={stylesPage.contText}>
              <Text>No hay hilos en esta lista</Text>
            </View>
            <AdsComponent
              subscription={this.state.subs_active}
              typeAd={"banner"}
            />
          </Container>
        );
      } else {

        return (
          <Container style={styles.generalContainer}>
              <StatusBar
               barStyle="dark-content"
             />
              {this.renderHeader()}

              <FlatList
                removeClippedSubviews
                disableVirtualization
                data={this.state.temasForo.post}
                renderItem={({ item, index, navigation }) => <TemaForo
                  showStars={false}
                  temaForo={{item, index, nav}}
                  adsIntersticial={this.ads}
                  onBackRefresh={this.returnRefresh.bind(this)}
                  subs_active={this.state.subs_active}
                  blnOnlyPendingView={true}
                />}
                keyExtractor={item => item.link}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh.bind(this)}
                //onEndReached={this.handleLoadMore.bind(this)}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                //onEndReachedThreshold={0.5}
                extraData={this.state.subs_active}
              />
              <AdsComponent
                subscription={this.state.subs_active}
                typeAd={"banner"}
              />
          </Container>
        );
      }
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

const stylesPage = {
  contText: {
    justifyContent: "center",
    alignItems: 'center',
    fontSize: 16,
    marginTop: 50
  }
}
