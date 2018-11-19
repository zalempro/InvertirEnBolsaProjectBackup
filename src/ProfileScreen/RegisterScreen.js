import React from "react";

import { View, ScrollView, Image, Text, ActivityIndicator, Linking, WebView} from "react-native";
import { Button, Icon } from "native-base";
import { Button as ButtonEle} from "react-native-elements";
import { TextField } from 'react-native-material-textfield';
import stylesGen from '../Style/styleApp.js';
import DropdownAlert from 'react-native-dropdownalert';
import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';
import AdsComponent from '../Ads/AdsComponent.js';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';




export default class RegisterScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Registrar",
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
      usuario: '',
      password: '',
      loading: true
    };

    this.util = new Utils();

    this.analytics = new Analytics();
    this.analytics.trackScreenView("RegisterScreen");
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

  render() {
    let { usuario, password, errors = {} } = this.state;

    return (
      <View style={styles.containerBack}>
        <WebView
          source={{uri: 'https://www.invertirenbolsa.info/foro-inversiones/register.php'}}
        //  startInLoadingState={false}
          automaticallyAdjustContentInsets={true}
          scrollEnabled={true}
          javaScriptEnabled={true}
          scalesPageToFit={true}
          style={styles.webview}
          />
        <DropdownAlert
          ref={ref => this.dropdown = ref}
          onClose={data => this.onClose(data)} />
      </View>
    );
  }
}

const styles = {
  containerBack: {
    backgroundColor: '#FFFFFF',
    paddingLeft: 0,
    paddingRight: 0,
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
  },
  webview: {
    flex: 1,

  }
}
