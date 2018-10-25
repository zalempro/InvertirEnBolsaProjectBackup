import React from "react";

import { View, ScrollView, KeyboardAvoidingView, Image, Text } from "react-native";
import { Button, Icon } from "native-base";
import { Button as ButtonEle} from "react-native-elements";
import { TextField } from 'react-native-material-textfield';
import stylesGen from '../Style/styleApp.js';
import {enviarNewTema} from './ApiForo.js';
import DropdownAlert from 'react-native-dropdownalert';
import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';

export default class NewTemaScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Nuevo Tema",
    headerRight: (
      <Button
        transparent
        onPress={() => navigation.goBack()}>
        <Icon name="menu" />
      </Button>
    )
  });

  constructor(props) {
    super(props);

    //this.onFocus = this.onFocus.bind(this);
    //this.titulo_reply = this.updateRef.bind(this, 'titulo_reply');
    //this.message_reply = this.updateRef.bind(this, 'message_reply');

    this.entradaUrl = this.props.navigation.getParam('entradaUrl', '');
    this.titleEntrada = this.props.navigation.getParam('titleEntrada', '');

    this.util = new Utils();

    this.analytics = new Analytics();
    this.analytics.trackScreenView("NewTemaScreen");

    this.state = {
      titulo_reply: '',
      message_reply: '',
      NewTema: null
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

  saveRespuesta() {
    console.log("saveRespuesta")
    //let { usuario, password } = this.state;

    let errors = {};
    let blnError = false;


    if (this.state.titulo_reply == "") {
      errors['titulo_reply'] = 'No puede estar vacío';
      blnError = true;
    } else {
      if (this.state.titulo_reply.length > 80) {
        errors['titulo_reply'] = 'Título demasiado grande';
        blnError = true;
      }
    }
    if (this.state.message_reply == "") {
      errors['message_reply'] = 'No puede estar vacío';
      blnError = true;
    } else {
      if (this.state.message_reply.length > 2000) {
        blnError = true;
        errors['message_reply'] = 'Mensaje demasiado grande';
      }
    }
    if ((this.state.usuario == "") || (this.state.password == "")) {
      blnError = true;
      this.onError("Debes de rellenar la información de Login en el pefil");
    }

    this.setState({ errors });

    if (!blnError) {
      enviarNewTema(this.entradaUrl,
                     this.state.titulo_reply,
                     this.state.message_reply,
                     this.state.usuario,
                     this.state.password
                   )
      .then((resultTema) => {
        this.setState({
          newTema:resultTema,
        });

        //console.log(resultReply);

        if (this.state.newTema != null) {
          if ((this.state.newTema.resultNewTema == null) ||
             (this.state.newTema.resultNewTema != 1)) {
             blnError = true;
          } else {
            this.onSuccess("Respuesta enviada");
          }
        } else {
          blnError = true;
        }

        if (blnError) {
          this.onError("Error al enviar la respuesta");
        }
      });

    }
  }

  //Funciones par mostrar alert
  onError = error => {
    if (error) {
      this.analytics.trackEvent("NewTemaScreen", "New Tema KO");
      this.dropdown.alertWithType('error', 'Error', error);

    }
  };
  onSuccess = success => {
    if (success) {
      this.analytics.trackEvent("NewTemaScreen", "New Tema OK");
      this.dropdown.alertWithType('success', 'OK', success);
    }
  };
  onClose(data) {
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
    if (data.type == "success") {
      //this.props.navigation.goBack();
      this.props.navigation.navigate("ForumScreen");
    }
  }


  render() {
    let { titulo_reply, message_reply, errors = {} } = this.state;

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
            <Text style={styles.loginTitle}>{this.titleEntrada}</Text>
          </View>
          <TextField
          //ref={this.titulo_reply}
          label='Título'
          value={titulo_reply}
          characterRestriction={80}
          onChangeText={ (titulo_reply) => this.setState({ titulo_reply }) }
          error={errors.titulo_reply}
          />
          <TextField
          //ref={this.message_reply}
          label='Respuesta'
          value={message_reply}
          multiline={true}
          characterRestriction={2000}

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
          onPress={() => this.saveRespuesta()}
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
    flex: 1
  },
  containerBackFirst: {
    backgroundColor: '#FFFFFF',
    paddingLeft: 25,
    paddingRight: 25,
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
    //padding: 10,
    //height: 100,
    alignItems: 'center',
    fontFamily: 'HelveticaNeue',
    fontSize: 20,
    //flex: 1,
    //flexDirection: 'row',
  }
}
