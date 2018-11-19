import React from "react";
import { StatusBar, View, FlatList, ActivityIndicator, Dimensions} from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, CheckBox, ListItem} from "native-base";

import { getEntradasForo, actualizarNotificacionHilo } from './ApiForo.js';

import EntradaForo from './EntradaForo.js';

import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';
import AdsComponent from '../Ads/AdsComponent.js';
import AdsIntersticial from '../Ads/AdsIntersticial.js';
import DropdownAlert from 'react-native-dropdownalert';

//Cargamos stylos
import styles from '../Style/styleApp.js';



export default class EntradaScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('titleTema', ''),
    headerLeft: (
      <View>
        <Button transparent onPress={() => {
              const refreshFunction = navigation.state.params.refreshFunction;
              if(typeof refreshFunction === 'function')
              {
                refreshFunction(navigation.state.params.indexTema);
                navigation.goBack();
              } else {
                navigation.goBack();
              }
            }
          }>
          <Icon name="arrow-back" />
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
      this.entradaUrl = this.props.navigation.getParam('entradaUrl', '');
      this.blnOnlyPendingView = this.props.navigation.getParam('blnOnlyPendingView', '');

      //console.log("blnOnlyPendingView:",this.blnOnlyPendingView)

      this.isCancelled = false;
      this.goToIndex = true;

      this.state = { entradasForo: [],
        refreshing   : false,
        paginasTot   : this.props.navigation.getParam('paginasTema', ''),
        paginaActual : 0,
        paginaLess   : 0,
        loading : false,
        refreshing: false,
        blnCargaInicial: true,
        blnRecibirNotif: false,
        blnNotificacionesUserActivas: false
      };
      this.loading = false;

      this.util      = new Utils();
      this.analytics = new Analytics();
      this.analytics.trackScreenView("EntradaScreen");

      this.viewabilityConfig = {
          viewAreaCoveragePercentThreshold: 50
      };

      this.fetchEntradasForo = this.fetchEntradasForo.bind(this);
    }

    // Called after a component is mounted
    async componentDidMount() {
      this.loading = true;
      const infoAuth = this.util.getAuthInfo(this);
      const valAu = await infoAuth;

      const infoResult = this.util.getSubscriptionInfo(this);
      const valRes = await infoResult;
      this.loading = false;

      if (this.state.usuario != null) {
          this.ads = new AdsIntersticial(this.state.subs_active, 4, this);
          this.fetchEntradasForo("initLoad");
      } else {
        this.loading = false;
        !this.isCancelled && this.setState({ loading: false });
        this.onError("Introduce la información de login");
      }
    }




    componentWillUnmount() {
        this.isCancelled = true;
    }

    fetchEntradasForo(strTypeLoad) {
      //console.log("principio fetch")
      if (!this.loading) {
        //console.log("dentro fetch")

        this.loading = true;
        this.analytics.trackEvent("EntradaScreen", "Carga entrada/hilo");

        getEntradasForo(
          this.entradaUrl,
          this.state.paginasTot,
          this.state.paginaActual,
          this.state.paginaLess,
          this.state.entradasForo,
          this.state.usuario,
          this.state.password,
          strTypeLoad
        )
          .then(entradasForo => {
              if (strTypeLoad == "initLoad") {
                //console.log(entradasForo)
                this.loading = false;
                !this.isCancelled && this.setState({
                  entradasForo: entradasForo,
                  paginaActual: entradasForo.paginaActual,
                  paginaLess: entradasForo.paginaActual,
                  refreshing: false,
                  loadling: false,
                  blnRecibirNotif:entradasForo.isActiveNotification,
                  blnNotificacionesUserActivas: entradasForo.isActiveUserNotification
                }, () => {
                  //this.flatListRef.scrollToIndex({animated: true, index: "" + 4, viewPosition: 0})
                });
              } else {
                this.loading = false;
                !this.isCancelled && this.setState({ entradasForo: entradasForo, refreshing: false, loading: false });
              }
          })
          .catch(() => {
              this.loading = false;
              !this.isCancelled && this.setState({ refreshing: false, loading: false })
            }
          );
        }
    }

    handleRefresh = () => {
      !this.isCancelled && this.setState(
        {
          blnCargaInicial: false,
          refreshing: true
        },
         () => this.fetchEntradasForo("initLoad")
        );
    };

    handleLoadLess = () => {
      //console.log("1 - handleLoadLess")
      //this.flatListRef.scrollToIndex({animated: true, index: 2});
      !this.isCancelled && this.setState({blnCargaInicial: false})

      if (parseInt(this.state.paginaLess) > 1) {
        strTypeLoad = "less";
        !this.isCancelled && this.setState(
          {
            refreshing: true,
            paginaLess : parseInt(this.state.paginaLess) - 1
          }, () => {
            this.fetchEntradasForo(strTypeLoad);
            this.ads.showIntersticialAd();
          });
      }
    };

    handleLoadMore = () => {
      if ((parseInt(this.state.paginaActual) >= 1) && (parseInt(this.state.paginaActual) < parseInt(this.state.paginasTot))) {
        strTypeLoad = "more";
        !this.isCancelled && this.setState(
          {
            refreshing: true,
            paginaActual : parseInt(this.state.paginaActual) + 1
          }, () => {
            this.fetchEntradasForo(strTypeLoad);
            this.ads.showIntersticialAd();
          });
      }
    };


  renderHeader =() => {
    if ((!this.loading) || (this.loading && this.state.refreshing)) return null;

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

  renderCheckNotificaciones() {
    if (this.state.blnNotificacionesUserActivas) {
      return(
        <ListItem onPress={() => this.recibirNotificaciones()}>
          <CheckBox style={styles2.ListCheckBox} checked={this.state.blnRecibirNotif} color="green" onPress={() => this.recibirNotificaciones()}/>
          <Text style={styles2.CheckBoxText}>Añadir hilo a favoritos</Text>
        </ListItem>
      );
    } else {
      return null;
    }
  }


  renderReplyButton() {

    if (this.state.entradasForo.hiloAbierto) {
      return (
        <React.Fragment>
          <Button iconLeft block
            onPress={() => this.props.navigation.navigate("NewReplyScreen",{
              entradaUrl: this.props.navigation.getParam('entradaUrl', ''),
              titleEntrada: this.props.navigation.getParam('titleTema', ''),
              refreshFunction: this.handleRefresh
            })}
            style={styles2.ButtStyle}
            >
              <Icon name="document"/>
              <Text>Nueva Respuesta</Text>
          </Button>
          {this.renderCheckNotificaciones()}
        </React.Fragment>
      );
    } else {
      return(null)
    }
  }

  //Cambiar estado de recepción de notificaciones
  recibirNotificaciones() {
    actualizarNotificacionHilo(
      this.entradaUrl,
      this.state.usuario,
      !this.state.blnRecibirNotif
    )
    .then(blnResult => {
      //console.log("result update hilo:", blnResult)
      if (blnResult) {
        !this.isCancelled && this.setState({blnRecibirNotif: !this.state.blnRecibirNotif});
        this.analytics.trackEvent("EntradaScreen", "Act/Des Notificaciones Hilo");
      }
    });
  }

  renderMensajeNoHayPostsNuevos(blnOnlyPendingView, blnCargaInicial) {
    blnIsNew = false;
    if (this.state.entradasForo.post != null) {
      this.state.entradasForo.post.map((post) => {
          if (post.isNew) {
            blnIsNew = true;
          }
      });

      if (!blnIsNew && blnOnlyPendingView && blnCargaInicial) {
        return(
          <View style={styles2.JustText} >
            <Text>No hay entradas nuevas.</Text>
            <Text>Arrastra para ver las antiguas.</Text>
          </View>
        );
      }
    }
  }

  render() {

    let nav = this.props.navigation;
    //console.log("manu0", nav)

    if (this.state.usuario != null) {

      return (
        <Container style={styles.generalContainer} >
            {this.renderReplyButton()}
            {this.renderHeader()}
            {this.renderMensajeNoHayPostsNuevos(this.blnOnlyPendingView, this.state.blnCargaInicial)}
            <FlatList
              removeClippedSubviews
              disableVirtualization
              data={this.state.entradasForo.post}
              renderItem={({ item, index }) => <EntradaForo
                nav={this.props.navigation}
                entradaForo={{item, index}}
                subs_active={this.state.subs_active}
                blnOnlyPendingView={this.blnOnlyPendingView}
                blnCargaInicial={this.state.blnCargaInicial}
              />}
              keyExtractor={item => item.numPost}
              refreshing={this.state.refreshing}
              onRefresh={this.handleLoadLess.bind(this)}
              onEndReached={this.handleLoadMore.bind(this)}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              onEndReachedThreshold={0.5}
              //extraData={this.state.subs_active}
              extraData={this.state}

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
  },
  ListCheckBox: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'red'
  },
  CheckBoxText: {
    marginLeft: 20
  },
  JustText: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20

  }
};
