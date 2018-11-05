import React from "react";

import { View, KeyboardAvoidingView, ScrollView, Image, Text } from "react-native";
import { Button, Icon } from "native-base";
import { Button as ButtonEle} from "react-native-elements";
import { TextField } from 'react-native-material-textfield';
import stylesGen from '../Style/styleApp.js';
import {enviarContacto} from '../ForumScreen/ApiForo.js';
import DropdownAlert from 'react-native-dropdownalert';
import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';

export default class ContactoScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Contacto",
    headerRight: (
      <Button
        transparent
        onPress={() => navigation.openDrawer()}>
        <Icon name="menu" />
      </Button>
    )
  });

  constructor(props) {
    super(props);

    //this.titulo_reply = this.updateRef.bind(this, 'titulo_reply');
    //this.message_reply = this.updateRef.bind(this, 'message_reply');


    //this.report = this.props.navigation.getParam('report', '');
    //this.posttitle = this.props.navigation.getParam('posttitle', '');

    this.util = new Utils();

    this.analytics = new Analytics();
    this.analytics.trackScreenView("ContactoScreen");

    this.state = {
      message_reply: '',
      newReply: null
    };
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  componentDidMount() {
    var util = new Utils();
    util.getKey("AuthIEB","usuario", this);
    util.getKey("AuthIEB","password", this);
  }

  saveReportRespuesta() {

    let errors = {};
    let blnError = false;

    if (this.state.message_reply == "") {
      errors['message_reply'] = 'No puede estar vacío';
      blnError = true;
    } else {
      if (this.state.message_reply.length > 1000) {
        blnError = true;
        errors['message_reply'] = 'Respuesta demasiado grande';
      }
    }
    if ((this.state.usuario == "") || (this.state.password == "")) {
      blnError = true;
      this.onError("Debes de rellenar la información de Login en el pefil");
    }

    this.setState({ errors });

    if (!blnError) {
      enviarContacto(
                   this.state.message_reply
                 )
      .then((resultReply) => {
        this.setState({
          newReply:resultReply,
        });

        //console.log(resultReply);

        if (this.state.newReply != null) {
          if ((this.state.newReply.resultNewReply == null) ||
             (this.state.newReply.resultNewReply != 1)) {
             blnError = true;
          } else {
            this.onSuccess("Enviado correctamente");
          }
        } else {
          blnError = true;
        }

        if (blnError) {
          this.onError("Error al enviar el mensaje");
        }
      });

    }
  }

  //Funciones par mostrar alert
  onError = error => {
    if (error) {
      this.analytics.trackEvent("ContactoScreen", "New Contacto KO");
      this.dropdown.alertWithType('error', 'Error', error);
    }
  };
  onSuccess = success => {
    if (success) {
      this.analytics.trackEvent("ContactoScreen", "New Contacto OK");
      this.dropdown.alertWithType('success', 'OK', success);
    }
  };
  onClose(data) {
    if (data.type == "success") {
       this.props.navigation.goBack();
    }
  }

  render() {
    let { message_reply, errors = {} } = this.state;

    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.containerBackFirst}
      >
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
          <Text style={styles.loginTitle}>Contacto</Text>
        </View>
        <TextField
        //ref={this.message_reply}
        label='Mensaje'
        value={message_reply}
        multiline={true}
        characterRestriction={1000}

        autoCapitalize='none'
        autoCorrect={false}
        returnKeyType='done'

        onChangeText={ (message_reply) => this.setState({ message_reply }) }
        //onFocus={this.onFocusElement('password')}
        error={errors.message_reply}
        />

        <ButtonEle
        leftIcon={{name: 'send'}}
        title='Enviar'
        buttonStyle={{
          backgroundColor: "#0099ff",
          flex: 1,
          borderColor: "transparent",
          borderWidth: 0,
          borderRadius: 5,
          marginTop: 50,
          marginBottom: 25
        }}
        onPress={() => this.saveReportRespuesta()}
        />
        <View style={{ height: 80 }} />
        <DropdownAlert
          ref={ref => this.dropdown = ref}
          onClose={data => this.onClose(data)} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = {
  containerBack: {
    backgroundColor: '#FFFFFF',
    paddingLeft: 25,
    paddingRight: 25,
    flex: 1,
  },
  containerBackFirst: {
    backgroundColor: '#FFFFFF',
    flex: 1
  },
  loginZone: {
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,

  },
  loginTitle: {
    alignItems: 'center',
    fontFamily: 'HelveticaNeue',
    fontSize: 20,
  }
}
