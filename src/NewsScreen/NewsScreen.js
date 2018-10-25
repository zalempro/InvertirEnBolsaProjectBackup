import React from "react";
import { StatusBar , FlatList, ActivityIndicator } from "react-native";
import { Container, Header, View, Title, Left, Text, Icon, Right, Button, Body, Content, Card, Form, Item, Picker } from "native-base";

import { getNews } from './ApiNews.js';
import Noticia from './Noticia.js';
import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';

import DropdownAlert from 'react-native-dropdownalert';
import AdsComponent from '../Ads/AdsComponent.js';
import AdsIntersticial from '../Ads/AdsIntersticial.js';

import stylesGen from '../Style/styleApp.js';

export default class NewsScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: "Noticias Diarias",
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
      noticias: [],
      refreshing: false,
      loading: false,
      indexPais: "all",
      indexEmpresa: "0",
      limitStart: "0",
      usuario: null,
      subs_active: "0"
    };
    this.fetchNews = this.fetchNews.bind(this);
    this.util = new Utils();

    this.analytics = new Analytics();
    this.analytics.trackScreenView("NewsScreen");

  }

  // Called after a component is mounted
  async componentDidMount() {
    this.setState({ loading: true });

    const infoAuth = this.util.getAuthInfo(this);
    const valAu = await infoAuth;
    const infoResult = this.util.getSubscriptionInfo(this);
    const valRes = await infoResult;

    //if (this.state.subs_active == "1") {
      if (this.state.usuario != null) {
          this.ads = new AdsIntersticial(this.state.subs_active, 5,this);
          this.setState({ loading: false });
          this.fetchNews(false);
      } else {
        this.setState({ loading: false });
        this.onError("Introduce la información de login");
      }
    //} else {
    //  this.setState({ loading: false });
    //  this.onError("Para acceder al contenido es necesario tener una suscripción activa");
    //}

   }

  fetchNews(blnLoadMore) {
    if (!this.state.loading) {
      this.setState({ loading: true });

      this.analytics.trackEvent("NewsScreen", "Carga noticias");

      getNews(
        this.state.indexPais,
        this.state.indexEmpresa,
        this.state.limitStart,
        this.state.noticias,
        blnLoadMore
      )
        .then(noticias => this.setState({
          noticias,
          refreshing: false,
          loading: false
        }))
        .catch(() => this.setState({ refreshing: false, loading: false }));
    }
  }

  handleRefresh() {
    this.setState(
      {
        refreshing: true,
        limitStart: "0"
    },
      () => {
        this.ads.showIntersticialAd();
        this.fetchNews(false)
      }
    );
  }

  handleLoadMore = () => {
    if (!this.state.loading) {
      if (this.state.limitStart >= 0) {
        this.setState(
          {
            limitStart : Number(this.state.limitStart) + 40
          }, () => {
            this.ads.showIntersticialAd();
            this.fetchNews(true);
          });
      }
    }
  };

  renderHeader =() => {
    if ((!this.state.loading) || (this.state.loading && this.state.refreshing)) return null;

    return (
      <ActivityIndicator style={stylesGen.ActivityIndicator} animating size="large" />
    );
  }

  onValueChangePais(value) {
    this.setState({
      indexPais: value,
      limitStart: "0"
    },
    () =>{
        this.fetchNews(false),
        this.refs.listRef.scrollToOffset({x: 0, y: 0, animated: true},
        this.ads.showIntersticialAd())
      }
  );
  }

  onValueChangeEmpresa(value) {
    this.setState({
      indexEmpresa: value,
      limitStart: "0"
    },
      () =>{
          this.fetchNews(false),
          this.refs.listRef.scrollToOffset({x: 0, y: 0, animated: true},
          this.ads.showIntersticialAd())
        }
    );
  }

  renderPickerPais = () => {
    if (this.state.noticias.paises != undefined) {
      let arrPaises = this.state.noticias.paises;
      return (
        arrPaises.map(item => <Picker.Item key={item.value} label={this.util.decodeData(item.pais)} value={item.value} />)
      )
    }
  }

  renderPickerEmpresa = () => {
    if (this.state.noticias.empresas != undefined) {
      let arrPaises = this.state.noticias.empresas;
      return (
        arrPaises.map(item => <Picker.Item key={item.value} label={this.util.decodeData(item.empresa)} value={item.value} />)
      )
    }
  }

  //Funciones par mostrar alert
  onError = error => {
    if (error) {
      this.dropdown.alertWithType('error', 'Error', error);

    }
  };
  onClose(data) {
    if (data.type == "error") {
      //if (this.state.subs_active == "0") {
      //  this.props.navigation.navigate("SubscriptionScreen");
      //} else {
        this.props.navigation.navigate("Profile");
      //}
    }
  }

  render() {
    //console.log(this.state.usuario)

    if (this.state.usuario != null) {

      //console.log(this.state.noticias.lista_noticias)
      return (
        <Container style={stylesGen.generalContainer}>
          <Form style={styles.ViewView}>
            <View style={{height: 100}}>
            <Item picker style={styles.ItemPicker}
              key="idPaises"
              >
              <Text style={styles.textPicker}>Pais:</Text>
              <Picker
                mode="dropdown"
                headerBackButtonText="Atras"
                iosHeader="Paises"
                headerStyle={styles.headePicker}
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                style={styles.PickerObj}
                placeholder="Selecciona el Pais"
                placeholderStyle={{ color: "#999999" }}
                textStyle={styles.TextSelectedPicker}
                placeholderIconColor="#007aff"
                selectedValue={this.state.indexPais}
                onValueChange={this.onValueChangePais.bind(this)}
              >
                {this.renderPickerPais()}
              </Picker>
            </Item>
            <Item picker style={styles.ItemPicker}
              key="idEmpresas"
              >
              <Text style={styles.textPicker}>Empresa:</Text>
              <Picker
                mode="dropdown"
                headerBackButtonText="Atras"
                iosHeader="Empresas"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                style={styles.PickerObj}
                placeholder="Selecciona la empresa"
                placeholderStyle={{ color: "#999999"}}
                textStyle={styles.TextSelectedPicker}
                placeholderIconColor="#007aff"
                selectedValue={this.state.indexEmpresa}
                onValueChange={this.onValueChangeEmpresa.bind(this)}
              >
                {this.renderPickerEmpresa()}
              </Picker>
            </Item>
          </View>
          {this.renderHeader()}
          <FlatList
            ref="listRef"
            removeClippedSubviews
            disableVirtualization
            data={this.state.noticias.lista_noticias}
            renderItem={({ item, index }) => <Noticia noticia={{item, index}} />}
            keyExtractor={item => item.link}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh.bind(this)}
            onEndReached={this.handleLoadMore.bind(this)}
            initialNumToRender={40}
            maxToRenderPerBatch={5}
            onEndReachedThreshold={0.5}
          />
          </Form>
          <AdsComponent
            subscription={this.state.subs_active}
            typeAd={"banner"}
          />
        </Container>
      );
    } else {
      return (
        <DropdownAlert
          ref={ref => this.dropdown = ref}
          onClose={data => this.onClose(data)} />
      )
    }

  }
}

const styles = {
  ViewView: {
    flex: 1,
    flexDirection: 'column'
  },
  ItemPicker : {
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textPicker: {
    padding: 0,
    //textAlign : 'Left'
  },
  PickerObj: {
    padding: 0,
    alignItems: 'flex-end',
    //textAlign : 'Right',
  },
  headePicker: {
    height: 55
  },
  TextSelectedPicker: {
    marginBottom:5
  }
};
