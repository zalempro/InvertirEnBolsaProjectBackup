import React from "react";

import { View, ScrollView, Image, Text, ActivityIndicator, Linking } from "react-native";
import { Button, Icon } from "native-base";
import { Button as ButtonEle} from "react-native-elements";
import { TextField } from 'react-native-material-textfield';
import stylesGen from '../Style/styleApp.js';
import {loginForum, createUserChatkit} from './ApiProfile.js';
import DropdownAlert from 'react-native-dropdownalert';
import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';
import AdsComponent from '../Ads/AdsComponent.js';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import Chatkit from "@pusher/chatkit";


export default class Profile extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Login",
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

    this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

    this.state = {
      usuario: '',
      password: '',
      loginForo: null,
      secureTextEntry: true,
      loading: true
    };

    this.util = new Utils();

    this.analytics = new Analytics();
    this.analytics.trackScreenView("ProfileScreen");
  }

  async componentDidMount() {
    this.setState({ loading: true });

    const infoAuth = this.util.getAuthInfo(this);
    const valAu = await infoAuth;

    const infoResult = this.util.getSubscriptionInfo(this);
    const valRes = await infoResult;

    this.setState({ loading: false });
  }

  onFocusElement(strRef) {
    //console.log("focus")
    //console.log(strRef)
    /*let { errors = {} } = this.state;

    for (let name in errors) {
      let ref = this[name];

      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }

    this.setState({ errors });*/
  }

  saveLogin() {
    console.log("saveLogin")
    this.setState({ loading: true });
    //let { usuario, password } = this.state;

    let errors = {};
    let blnError = false;

    if (this.state.usuario == "") {
      errors['usuario'] = 'No puede estar vacío';
      blnError = true;
    }
    if (this.state.password == "") {
      errors['password'] = 'No puede estar vacío';
      blnError = true;
    }

    this.setState({ errors });

    if (!blnError) {
      loginForum(this.state.usuario, this.state.password)
      .then((resultLogin) => {
        this.setState({
          loginForo:resultLogin,
        });

        if (this.state.loginForo != null) {
          if ((this.state.loginForo.logged == null) ||
             (this.state.loginForo.logged != "1")) {
             blnError = true;
          } else {
            //Login correcto
            //console.log("Guardamos auth keys in Storage");
            this.util.saveKey("AuthIEB", "usuario",this.state.usuario);
            this.util.saveKey("AuthIEB","password",this.state.password);

            //Creamos usuario Chat
            //if (createUserChatkit(this.state.usuario)) {
            //  this.util.saveKey("AuthIEB","chatkit", "1");
            //}
            this.onSuccess("Login correcto");
          }
        } else {
          blnError = true;
        }

        if (blnError) {
          this.onError("No se ha podido realizar el login");
        }
        this.setState({ loading: false });
      }).catch((error) => {
        console.log("saveLogin: - Error loginForm:" + error);
        this.setState({ loading: false });
      });

    } else {
      this.setState({ loading: false });
    }
  }

  //Funciones par mostrar alert
  onError = error => {
    if (error) {
      this.analytics.trackEvent("ProfileScreen", "Login KO");
      this.dropdown.alertWithType('error', 'Error', error);
    }
  };
  onSuccess = success => {
    if (success) {
      this.analytics.trackEvent("ProfileScreen", "Login OK");
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

  renderPasswordAccessory() {
    let { secureTextEntry } = this.state;

    let name = secureTextEntry?
      'visibility':
      'visibility-off';

    return (
      <MaterialIcon
        size={24}
        name={name}
        color={TextField.defaultProps.baseColor}
        onPress={() => {this.setState({secureTextEntry: !secureTextEntry})}}
        suppressHighlighting
      />
    );
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
          <Text style={styles.loginTitle}>Login Fórum</Text>
        </View>
        <TextField
        label='Usuario'
        value={usuario}
        autoCapitalize='none'
        autoCorrect={false}
        enablesReturnKeyAutomatically={true}
        returnKeyType='done'
        onChangeText={ (usuario) => this.setState({ usuario }) }
        //onFocus={this.onFocusElement('usuario')}
        error={errors.usuario}
        />
        <TextField
        label='Password'
        value={password}
        secureTextEntry={this.state.secureTextEntry}
        autoCapitalize='none'
        autoCorrect={false}
        enablesReturnKeyAutomatically={true}
        returnKeyType='done'
        onChangeText={ (password) => this.setState({ password }) }
        renderAccessory={this.renderPasswordAccessory}
        //onFocus={this.onFocusElement('password')}
        error={errors.password}
        />
        {this.renderActivityMonitor()}
        <ButtonEle
        leftIcon={{name: 'person'}}
        title='Login'
        buttonStyle={{
          backgroundColor: "#0099ff",
          flex: 1,
          borderColor: "transparent",
          borderWidth: 0,
          borderRadius: 5,
          marginTop: 50,
          marginBottom: 25
        }}
        onPress={() => {
          this.saveLogin();
        }}
        />
        <ButtonEle
        title='Registrarse'
        color='#0099ff'
        buttonStyle={{
          backgroundColor: "transparent",
          flex: 1,
          borderColor: "#0099ff",
          borderWidth: 1,
          borderRadius: 5,
          marginTop: 0,
          marginBottom: 25
        }}
        onPress={() => Linking.openURL('https://www.invertirenbolsa.info/foro-inversiones/register.php') }
        />
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
