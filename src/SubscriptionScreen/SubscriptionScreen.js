import React from "react";

import { View, ScrollView, Image, Text, Platform, Alert, ActivityIndicator,
Linking } from "react-native";

import { Button, Icon } from "native-base";
import { Card, Divider, Button as ButtonEle} from "react-native-elements";
import stylesGen from '../Style/styleApp.js';
import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';

import { PricingCard } from 'react-native-elements'
import * as RNIap from 'react-native-iap';

const itemSkus = Platform.select({
  ios: [
    'ieb.info.subs.anual', 'ieb.info.subs.semestral','ieb.info.subs.mensual'
  ],
  android: [
    'ieb.info.subs.anual', 'ieb.info.subs.semestral','ieb.info.subs.mensual'
  ]
});


export default class SubscriptionScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Suscripción",
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
      products: null,
      receipt: null,
      platform: Platform.OS,
      loading: true,
      blnActiva: false,
      activeSubscriptionId: "",
      expiresDateSub: null,
      autoRenewActive: 0,

      latest_receipt_info: null
    };

    this.util = new Utils();

    this.analytics = new Analytics();
    this.analytics.trackScreenView("SubscripcionScreen");
  }


  async componentDidMount() {
    //console.log(this.state.platform)
    try {
      this.setState({ loading: true });

      const result = await RNIap.initConnection();
      console.log('result', result);

      const products = await RNIap.getSubscriptions(itemSkus);
      this.setState({products});
      this.setState({ loading: false });
      await this.getPurchasesHistory();

    } catch(err) {
      console.warn(err.code, err.message); // standardized err.code and err.message available
    }
  }

  componentWillUnmount() {
    RNIap.endConnection();
  }

  getActiveSubscription() {
    //console.log("getActiveSubscription")
    this.getPurchasesHistory()
  }

  getPurchasesHistory = async() => {
    this.setState({ loading: true });
    try {
      //console.log("1")
      const purchases = await RNIap.getPurchaseHistory();
      //console.log("2")
      if (purchases.length > 0) {
          purchase = purchases[0];

          let transactionReceipt = purchase.transactionReceipt;

          const receiptBody = {
            'receipt-data': transactionReceipt,
            'password': '321e3f340375461ca94588b7647c8c75'
          };
          let result = await RNIap.validateReceiptIos(receiptBody, true, 54);

          if (result) {
            this.setState({ latest_receipt_info: result.latest_receipt_info });

            result.latest_receipt_info.forEach((receipt) => {

                //console.log("bucle")
                let dateNow = Date.now();
                if (receipt.expires_date_ms > dateNow) {
                  let productId = receipt.product_id;
                  let expires_date_ms = receipt.expires_date_ms;
                  //console.log("Activa::", receipt);
                  this.setState({
                    blnActiva: true,
                    activeSubscriptionId: productId,
                    expiresDateSub: expires_date_ms,
                    autoRenewActive: result.pending_renewal_info[0].auto_renew_status
                  });

                  var util = new Utils();
                  util.saveKey("SubscriptionIEB", "subs_expiresDateSub",expires_date_ms);
                  util.saveKey("SubscriptionIEB", "subs_active","1");
                  util.saveKey("SubscriptionIEB", "subs_productId",productId);

                }
            })
          }
        }

    } catch(err) {
      console.warn(err); // standardized err.code and err.message available
      Alert.alert(err.message);
    }
    this.setState({ loading: false });
  }


  async validateReceipt() {
    const receiptBody = {
      'receipt-data': this.state.receipt,
      'password': '321e3f340375461ca94588b7647c8c75'
    };
    const result = await RNIap.validateReceiptIos(receiptBody, true, 54);
    //console.log("validateReceipt: ",result);
    if (result.status == 0) {
      //console.log("Validación OK : ", result.status);
      this.getActiveSubscription();
    }
  }

  buySubscribeItem = async(sku) => {
    try {
      //console.log('buySubscribeItem: ' + sku);
      const purchase = await RNIap.buySubscription(sku);
      console.info(purchase);
      this.setState({ receipt: purchase.transactionReceipt }
      , () => this.validateReceipt()
      );
    } catch (err) {
      console.warn(err.code, err.message);
      Alert.alert(err.message);
    }
  }

  restaurarCompras = async() => {
    this.getPurchasesHistory();
  }

  getPeriod(strTypePeriod) {
    var result = [];
    switch (strTypePeriod) {
      case "DAY":
      case "D":
      intMultPeriod = 1;
      strTypePeriodSingle = "dia";
      strTypePeriodMult = "dias";
      strTypeSingle = "diaria";
      strTypeMult = "dias";
      break;

      case "WEEK":
      case "W":
      intMultPeriod = 7;
      strTypePeriodSingle = "dia";
      strTypePeriodMult = "dias";
      strTypeSingle = "semanal";
      strTypeMult = "semanas";
      break;

      case "MONTH":
      case "M":
      intMultPeriod = 30;
      strTypePeriodSingle = "dia";
      strTypePeriodMult = "dias";
      strTypeSingle = "mensual";
      strTypeMult = "meses";
      break;

      case "YEAR":
      case "Y":
      intMultPeriod = 1;
      strTypePeriodSingle = "año";
      strTypePeriodMult = "años";
      strTypeSingle = "anual";
      strTypeMult = "años";
      break;

      default:
      intMultPeriod = 0;
      strTypePeriodSingle = "";
      strTypePeriodMult = "";
      strTypeSingle = "";
      strTypeMult = "";
      break;
    }

    result['intMultPeriod'] = intMultPeriod;
    result['strTypePeriodSingle'] = strTypePeriodSingle;
    result['strTypePeriodMult'] = strTypePeriodMult;
    result['strTypeSingle'] = strTypeSingle;
    result['strTypeMult'] = strTypeMult;

    return result;
  }


  condicionesEspecialesDiscount(product) {
    strCondicion = "";
    if (this.state.platform == 'ios') {
      switch (product['introductoryPricePaymentMode']) {
        case "FREETRIAL":

          //Obtenemos el multiplicador del periodo para hacerlo en dias
          arrPeriod = this.getPeriod(product['introductoryPriceSubscriptionPeriod']);

          intPeriodoTrial = arrPeriod['intMultPeriod'] * product['introductoryPriceNumberOfPeriods'];

          if (intPeriodoTrial == 0) {
            strCondicion = "";
          } else if (intPeriodoTrial == 1) {
            strCondicion = intPeriodoTrial + " " + arrPeriod['strTypePeriodSingle'] + " gratis de prueba";
          } else {
            strCondicion = intPeriodoTrial + " " + arrPeriod['strTypePeriodMult'] + " gratis de prueba";
          }
          break;
      }

    } else {
      //Android
      period = product['freeTrialPeriodAndroid'];
      if (period != "") {
        if (period.substring(0, 1) == 'P') {
            strTypePeriod = period.substring(period.length-1,period.length);
            intPeriod = period.substring(1,period.length-1);

            //Obtenemos la periodificación
            arrPeriod = this.getPeriod(strTypePeriod);

            intPeriodoTrial = arrPeriod['intMultPeriod'] * intPeriod;

            if (intPeriodoTrial == 0) {
              strCondicion = "";
            } else if (intPeriodoTrial == 1) {
              strCondicion = intPeriodoTrial + " " + arrPeriod['strTypePeriodSingle'] + " gratis de prueba";
            } else {
              strCondicion = intPeriodoTrial + " " + arrPeriod['strTypePeriodMult'] + " gratis de prueba";
            }
        }
      }
    }
    return strCondicion;
  }


  tipoRenovacion(product) {
    strRenovacion = "";
    if (this.state.platform == 'ios') {

      arrPeriod = this.getPeriod(product['subscriptionPeriodUnitIOS']);
      intPeriodoRen = arrPeriod['intMultPeriod'] * product['subscriptionPeriodNumberIOS'];

      if (intPeriodoRen == 0) {
        strRenovacion = "";
      } else if (product['subscriptionPeriodNumberIOS'] == "1") {
        strRenovacion = "Renovación " + arrPeriod['strTypeSingle'];
      } else {
        strRenovacion = "Renovación cada " + product['subscriptionPeriodNumberIOS'] + " " + arrPeriod['strTypeMult'];
      }

    } else {
      //android
      period = product['subscriptionPeriodAndroid'];
      if (period != "") {
        if (period.substring(0, 1) == 'P') {
            strTypePeriod = period.substring(period.length-1,period.length);
            intPeriod = period.substring(1,period.length-1);

            //Obtenemos la periodificación
            arrPeriod = this.getPeriod(strTypePeriod);

            intPeriodoRen = arrPeriod['intMultPeriod'] * intPeriod;

            if (intPeriodoRen == 0) {
              strRenovacion = "";
            } else if (intPeriod == 1) {
              strRenovacion = "Renovación " + arrPeriod['strTypeSingle'];
            } else {
              strRenovacion = "Renovación cada " + intPeriod + " " + arrPeriod['strTypeMult'];
            }
        }
      }

    }
    return strRenovacion;
  }


  renderSubscriptionList() {

    const { products, platform } = this.state;

    if ((products != null) && (products != undefined)) {
      var returnValue = [];

      returnValue.push(
        <View
          key="id1View"
          style={styles.containerViewSub}>
          <Text style={styles.titleSubstription}>Elige un plan.</Text>
          <Text style={styles.subTitleSubstription}>
            Accede a todos los foros, datos de las empresas, noticias y mucho más próximamente.
            {"\n"}{"\n"}Cancélalo cuando quieras.
            {"\n"}Todos tienen 30 dias gratis.
          </Text>
        </View>
      );

      for (element in products) {
        let subsObj = products[element];

        returnValue.push(
          <PricingCard
            key={subsObj['productId']}
            color='#4f9deb'
            title={subsObj['title']}
            price={subsObj['localizedPrice']}
            info={[
              subsObj['description'],
              this.condicionesEspecialesDiscount(subsObj),
              'Acceso total SIN publicidad',
              this.tipoRenovacion(subsObj),
              'Renovación automàtica'
              ]}
            button={{ title: 'Suscríbete', icon: 'subscriptions' }}
            onButtonPress={() => this.buySubscribeItem(subsObj['productId'])}
          />
        );
      }
      return returnValue;

    } else {
      return null;
    }
  }



  renderActiveSubscription() {

    const { products, platform } = this.state;

    if ((products != null) && (products != undefined)) {
      const defaultImg = require('../../images/empresa_1_1.jpg');
      var returnValue = [];

      periodRenovacion = "";
      strExpireDate = "";
      strAutoRenewActive = "";
      for (i=0; i < products.length; i++) {
        if (products[i]["productId"] == this.state.activeSubscriptionId) {
          strExpireDate = new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(this.state.expiresDateSub);
          periodRenovacion = products[i]["title"];
          if (this.state.autoRenewActive == 1) {
            strAutoRenewActive = "ACTIVA";
          } else {
            strAutoRenewActive = "CANCELADA";
          }
        }
      }

      returnValue.push(
        <Image
          key="ImgActSub"
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
      );

      returnValue.push(
        <Card
          key="1"
          featuredTitle="Suscripción"
          //featuredTitleStyle={featuredTitleStyle}
          containerStyle={stylesGen.cardGeneral}
          image={defaultImg}
          >
          <Text style={styles.title}>Suscripción a InvertirEnBolsa.info</Text>
          <Divider style={styles.divider}/>
          <Text style={styles.mensajes}>Renovación: {periodRenovacion} - {strAutoRenewActive}</Text>
          <Divider style={styles.divider}/>
          <Text style={styles.mensajes}>Expira el {strExpireDate}</Text>
        </Card>
      );

      return returnValue;

    } else {
      return null;
    }
  }

  renderPoliticayLegal() {
    var returnValue = [];

    returnValue.push(
      <Text style={styles.textLegalAdvice}>El pago se cargará a la cuenta de iTunes en la confirmación de la compra</Text>
    );
    returnValue.push(
      <Text style={styles.textLegalAdvice}>La suscripción se renueva automáticamente a menos que la renovación automática se desactive al menos 24 horas antes del final del período actual</Text>
    );
    returnValue.push(
      <Text style={styles.textLegalAdvice}>Se cobrará por la renovación dentro de las 24 horas previas al final del período actual, e identificará el costo de la renovación</Text>
    );
    returnValue.push(
      <Text style={styles.textLegalAdvice}>Las suscripciones pueden ser administradas por el usuario y la renovación automática puede desactivarse yendo a la Configuración de la cuenta del usuario después de la compra</Text>
    );
    returnValue.push(
      <Text style={styles.textLegalAdvice}>Cualquier porción no utilizada de un período de prueba gratuito, si se ofrece, se perderá cuando el usuario compre una suscripción a esa publicación, cuando corresponda</Text>
    );

    returnValue.push(
      <ButtonEle
        key="butPolitica"
        onPress={ ()=>{ Linking.openURL('http://invertirenbolsa.manuelrispolez.com/politicaPrivacidad.html');}}
        title="Política de Privacidad, Términos y Condiciones"
        style={styles.subAdvice}
        fontSize={12}
      />

    );

    returnValue.push(
      <ButtonEle
        key="butAvisLeg"
        onPress={ ()=>{ Linking.openURL('https://www.invertirenbolsa.info/textos-legales/aviso-legal.htm');}}
        title="Aviso Legal"
        style={styles.subAdvice}
        fontSize={12}
      />
    );

    return returnValue;
  }

  render() {
      //console.log(this.state.blnActiva)
      if (this.state.loading) {
        return <ActivityIndicator style={stylesGen.ActivityIndicator} size="large" />
      } else {
        if ((this.state.products) && !(this.state.blnActiva)) {
            return(
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
                  {this.renderSubscriptionList()}
                  <ButtonEle
                    onPress={ ()=>{ this.restaurarCompras(); }}
                    title="Restaurar suscripción"
                    backgroundColor="#4f9deb"
                    icon={{ name: 'cloud-download' }}
                    style={styles.subAdvice}
                  />

                  <ButtonEle
                    onPress={() => this.props.navigation.navigate("ComprasSubsScreen",{
                      lista: this.state.latest_receipt_info
                    })}
                    title="Listado compras"
                    backgroundColor="#4f9deb"
                    icon={{ name: 'layers' }}

                    style={styles.subAdvice}
                  />
                  {this.renderPoliticayLegal()}
                </ScrollView>
            );
        } else {
          if ((this.state.products) && (this.state.blnActiva)) {
            return(
              <ScrollView style={styles.containerBack}>
                {this.renderActiveSubscription()}
                <ButtonEle
                  onPress={() => this.props.navigation.navigate("ComprasSubsScreen",{
                    lista: this.state.latest_receipt_info
                  })}
                  title="Listado compras"
                  backgroundColor="#4f9deb"
                  icon={{ name: 'layers' }}

                  style={styles.subAdvice}
                />
                {this.renderPoliticayLegal()}
              </ScrollView>
            );
          } else {
            return null;
          }
        }
      }
  }
}

const styles = {
  containerBack: {
    backgroundColor: '#FFFFFF',
    paddingLeft: 25,
    paddingRight: 25,
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  noteStyle: {
    margin: 5,
    fontStyle: 'italic',
    color: '#b2bec3',
    fontSize: 10
  },
  featuredTitleStyle: {
    margin: 10,
    position: 'absolute',
    top: 0,
    //textShadowColor: '#00000f'
    //textShadowOffset: { width: 3, height: 3 },
    //textShadowRadius: 3
  },
  featuredSubtitleStyle: {
    margin:10,
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  stadistic : {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  temas: {
    //textAlign : 'Left'
  },
  mensajes: {
    alignItems: 'flex-end',
    //textAlign : 'Right'
  },
  divider: {
    marginTop: 5,
    marginBottom: 5
  },
  containerViewSub: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleSubstription: {
    margin: 25,
    fontWeight: 'bold',
    fontSize: 16
  },
  subTitleSubstription: {
    margin: 20,
    marginTop: 0,
    fontSize: 16,
    textAlign: 'center'
  },
  subAdvice: {
      marginTop: 15,
      marginBottom: 10
  },
  textLegalAdvice: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20
  }

}
