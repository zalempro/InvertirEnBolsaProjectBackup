import React from "react";

import { StatusBar, FlatList, View, ActivityIndicator, Platform, AppState } from "react-native";
import { Container, Header, Title, Left, Right, Icon, Button, Body, Content,Text, Card, CardItem} from "native-base";

import { getUltPostsForo }      from '../ForumScreen/ApiForo.js';
//import { updateNoficationList } from '../ForumScreen/ApiForo.js';
import { inicializaNotificaciones } from '../NotificacionesScreen/ApiNotificaciones.js';

import TemaForo from '../ForumScreen/TemaForo.js';

import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';
import AdsIntersticial from '../Ads/AdsIntersticial.js';
import DropdownAlert from 'react-native-dropdownalert';
import AdsComponent from '../Ads/AdsComponent.js';
import OneSignal from 'react-native-onesignal';

//Cargamos stylos
import styles from '../Style/styleApp.js';

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;

    return {
    title: "Posts nuevos",
    headerLeft: state.params && state.params.DActivity,
    headerRight: (
      <View>
        <Button
          transparent
          onPress={() => navigation.openDrawer()}>
          <Icon name="menu" />
        </Button>
      </View>
    )}
  };

  constructor(props) {
    super(props);
    this.state = {
      temasForo: [],
      refreshing: false,
      loading: false,
      paginasTot: 0,
      paginaActual: 1,
      usuario: null,
      searchURL: '',
      appState: AppState.currentState
    };
    this.props.navigation.setParams({ DActivity: null});


    this.util = new Utils();

    this.analytics = new Analytics();
    this.analytics.trackScreenView("UltimosPosts");

    this.fetchTemasForo = this.fetchTemasForo.bind(this);

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

    //!this.isCancelled && this.setState({ loading: false });

    if (this.state.usuario != null) {
        this.fetchTemasForo(true);

        OneSignal.getPermissionSubscriptionState((status) => {
            this.setState({ userIdToken: status.userId });
            inicializaNotificaciones(
              this.state.usuario, this.state.password, status.userId, Platform.OS
            );
        });

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

  componentDidUpdate(nextProps, prevState) {
    if ((prevState.loading !== this.state.loading) || (prevState.refreshing !== this.state.refreshing)) { // redux props from language picker
      if ((!this.state.loading) || (this.state.loading && this.state.refreshing)) {
        this.props.navigation.setParams({ DActivity: null});
      } else {
        this.props.navigation.setParams({ DActivity:  <ActivityIndicator style={styles.ActivityIndicator3} animating />});
      }
    }
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/background/) && nextAppState === 'active') {
      this.handleRefresh();
    }
    this.setState({appState: nextAppState});
  }


  fetchTemasForo(blnReset) {
    if (this.state.loading) {
      //!this.isCancelled && this.setState({ loading: true });

      this.analytics.trackEvent("UltimosPosts", "Carga Temas");

      getUltPostsForo(
        this.state.searchURL,
        this.state.paginasTot,
        this.state.paginaActual,
        this.state.temasForo,
        this.state.usuario,
        this.state.password,
        blnReset
      )
      .then(temasForo => this.setState({
        temasForo,
        refreshing: false,
        loading: false,
        paginasTot: Number(temasForo.paginasTot),
        paginaActual: Number(temasForo.paginaActual),
        searchURL: temasForo.searchURL
      }))
      .catch(() => { !this.isCancelled && this.setState({ refreshing: false, loadling: false })});

      /*if ((this.state.usuario != null) && (this.state.password != null) && (this.state.userIdToken != null)) {
        updateNoficationList(this.state.usuario, this.state.password, this.state.userIdToken, Platform.OS);
      } else if  ((this.state.usuario != null) && (this.state.password != null)) {
        OneSignal.getPermissionSubscriptionState((status) => {
            //console.log(status);
            !this.isCancelled && this.setState({ userIdToken: status.userId });
            updateNoficationList(this.state.usuario, this.state.password, status.userId, Platform.OS);
        });
      }*/

    }
  }

 handleRefresh = async () => {
    !this.isCancelled && this.setState(
      {
        refreshing: true,
        paginaActual: 1,
        loading: true
      },
       () => {
         this.fetchTemasForo(true);
         this.ads.showIntersticialAd();
       }
      );

  };

  returnRefresh = (indexValueStr) => {
    // title + '-' + lastPostDate
     !this.isCancelled && this.setState({
        refreshing: true
     });
     indexSel = -1;
     for(index = 0; index < this.state.temasForo.post.length; index++){
       title        = this.state.temasForo.post[index].title;
       lastPostDate = this.state.temasForo.post[index].lastPostDate;
       if (indexValueStr == title + '-' + lastPostDate) {
         indexSel = index;
         break;
       }
     }
     if (indexSel != -1) {
       arrTemp = this.state.temasForo;
       arrTemp.post.splice(indexSel, 1);

       !this.isCancelled && this.setState({
         temasForo: arrTemp,
         refreshing: false
       });
     } else {
       !this.isCancelled && this.setState({
         refreshing: false
       });
     }
     this.ads.showIntersticialAd();
   };

  handleLoadMore = () => {
    if (Number(this.state.paginaActual) < Number(this.state.paginasTot)) {
    !this.isCancelled && this.setState(
        {
          paginaActual : Number(this.state.paginaActual) + 1,
          loading: true
        }, () => {
          this.fetchTemasForo(false);
        });
    }
  };

  /*renderHeader =() => {
    if ((!this.state.loading) || (this.state.loading && this.state.refreshing)) return null;

    //this.props.navigation.setParams({ DActivity: <ActivityIndicator style={styles.ActivityIndicator2} animating /> });
    return (
      <ActivityIndicator style={styles.ActivityIndicator2} animating size="large" />
    );
  }*/

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

      return (
        <Container style={styles.generalContainer}>
            <StatusBar
             barStyle="dark-content"
           />

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
              onEndReached={this.handleLoadMore.bind(this)}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              onEndReachedThreshold={0.6}
              extraData={this.state.subs_active}
            />
        </Container>
      );
    } else {
      return (
        <Container style={styles.generalContainer}>

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
