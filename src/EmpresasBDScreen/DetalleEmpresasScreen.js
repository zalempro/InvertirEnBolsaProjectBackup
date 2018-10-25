import React from "react";
import { StatusBar, View, WebView, ActivityIndicator} from "react-native";
import { Container, Content, Icon, SearchBar, Button, Form, Item, Picker } from "native-base";
import { Text, Card, Divider, List, ListItem } from 'react-native-elements';
import { Text as TextSvg} from 'react-native-svg';
import { getDetalleEmpresa } from './ApiEmpresas.js';

import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';

import DropdownAlert from 'react-native-dropdownalert';
import AdsComponent from '../Ads/AdsComponent.js';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph
} from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import LineChartManu from '../Chart/LineChartManu.js';


import stylesGen from '../Style/styleApp.js';



export default class DetalleEmpresasScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('title', ''),
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
      empresa: [],
      urlEmpresa:  this.props.navigation.getParam('urlEmpresa', ''),
      title: this.props.navigation.getParam('title', ''),
      loading: false
    };

    this.arrHeaders = this.getConfigHeaders();
    this.util = new Utils();

    this.analytics = new Analytics();
    this.analytics.trackScreenView("DetalleEmpresasScreen");
  }

  async componentDidMount() {
    //this.getDetalleEmpresa();

    this.setState({ loading: true });

    const infoAuth = this.util.getAuthInfo(this);
    const valAu = await infoAuth;
    const infoResult = this.util.getSubscriptionInfo(this);
    const valRes = await infoResult;

    //if (this.state.subs_active == "1") {
      if (this.state.usuario != null) {
          this.setState({ loading: false });
          this.getDetalleEmpresa();
      } else {
        this.setState({ loading: false });
        this.onError("Introduce la información de login");
      }
    //} else {
    //  this.setState({ loading: false });
    //  this.onError("Para acceder al contenido es necesario tener una suscripción activa");
    //}
   }

  componentWillMount() {
    //this.getDetalleEmpresa();
  }

  componentWillUnmount() {
    //console.log("Desmontando")
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
    //   this.props.navigation.navigate("SubscriptionScreen");
     //} else {
       this.props.navigation.navigate("Profile");
     //}
   }
  }

  getDetalleEmpresa() {
    if (!this.state.loading) {
      this.setState({
        loading: true
      }, () => {
        getDetalleEmpresa( this.state.urlEmpresa)
          .then(empresa => this.setState({
            empresa: empresa,
            loading: false
            //dataSource: this.state.dataSource.cloneWithRows(data.datos_empresa),
          }))
          .catch(() => this.setState({ loading: false }));
      }
    );


    }
  }


  getConfigHeaders() {
    let arrHeadersConfig = {
      'ticker':{'literal':'Ticker','typeChart': 'LINE_CHART','group' : ''},
      'cotizacion':{'literal':'Cotización','typeChart': 'LINE_CHART','group' : ''},
      'num_acciones':{'literal':'Núm. acciones','typeChart': 'LINE_CHART','group' : ''},
      'capitalizacion':{'literal':'Capitalización','typeChart': 'LINE_CHART','group' : ''},
      'val_contable_accion':{'literal':'Valor contable por acción','typeChart': 'LINE_CHART','group' : ''},
      'precio_val_cont':{'literal':'Precio / Valor contable','typeChart': 'LINE_CHART','group' : ''},
      'ev_ebitda':{'literal':'EV / EBITDA','typeChart': 'LINE_CHART','group' : ''},
      'ev_ebit':{'literal':'EV / EBIT','typeChart': 'LINE_CHART','group' : ''},

      'ingresos':{'literal':'Ingresos','typeChart': 'LINE_CHART','group' : ''},
      'ebitda':{'literal':'EBITDA','typeChart': 'LINE_CHART','group' : ''},
      'ebit':{'literal':'EBIT','typeChart': 'LINE_CHART','group' : ''},
      'bpa_ord':{'literal':'BPA Ordinario','typeChart': 'LINE_CHART','group' : 'gr_bpa'},
      'div_ord':{'literal':'Dividendo ordinario','typeChart': 'LINE_CHART','group' : 'gr_div'},
      'cash_flow_exp':{'literal':'CASH-FLOW DE EXPLOTACIÓN','typeChart': 'LINE_CHART','group' : ''},
      'margen_bruto':{'literal':'Margen bruto','typeChart': 'LINE_CHART','group' : ''},
      'margen_neto_exp':{'literal':'Margen neto de explotación','typeChart': 'LINE_CHART','group' : ''},
      'margen_intereses':{'literal':'Margen de intereses','typeChart': 'LINE_CHART','group' : ''},

      'roa_medio':{'literal':'ROA medio','typeChart': 'LINE_CHART','group' : ''},
      'pcfpa_medio':{'literal':'P/CFPA medio','typeChart': 'BAR_CHART','group' : ''},
      'pre_val_con_medio':{'literal':'Precio / valor contable medio','typeChart': 'LINE_CHART','group' : ''},
      'per_medio':{'literal':'PER medio','typeChart': 'LINE_CHART','group' : ''},
      'rd_media':{'literal':'RD Media','typeChart': 'LINE_CHART','group' : ''},
      'roe_medio':{'literal':'ROE medio','typeChart': 'LINE_CHART','group' : ''},

      'bpa':{'literal':'BPA','typeChart': 'BAR_CHART','group' : ''},
      'per':{'literal':'PER','typeChart': 'BAR_CHART','group' : ''},
      'rpd':{'literal':'RPD','typeChart': 'BAR_CHART','group' : ''},
      'dpa':{'literal':'DPA','typeChart': 'BAR_CHART','group' : ''},

      'comi_netas':{'literal':'Comisiones netas','typeChart': 'LINE_CHART','group' : ''},
      'result_net_total':{'literal':'Resultado neto total','typeChart': 'LINE_CHART','group' : ''},
      'bpa_total':{'literal':'BPA total','typeChart': 'LINE_CHART','group' : 'gr_bpa'},
      //'%':{'literal':'%','typeChart': 'BAR_CHART','group' : ''},

      'resultado_net_ord':{'literal':'Resultado neto ordinario','typeChart': 'LINE_CHART','group' : ''},
      'bpa_extra':{'literal':'BPA extraordinario','typeChart': 'LINE_CHART','group' : 'gr_bpa'},
      'payout':{'literal':'Pay-out','typeChart': 'LINE_CHART','group' : ''},
      'payout':{'literal':'pay-out','typeChart': 'LINE_CHART','group' : ''},
      'div_extra':{'literal':'Dividendo extraordinario','typeChart': 'LINE_CHART','group' : 'gr_div'},
      'div_tot':{'literal':'Dividendo total','typeChart': 'LINE_CHART','group' : 'gr_div'},
      'observaciones':{'literal':'Observaciones','typeChart': 'BAR_CHART','group' : ''},
      'fondos_propios':{'literal':'Fondos propios','typeChart': 'LINE_CHART','group' : ''},
      'activos_totales':{'literal':'Activos totales','typeChart': 'LINE_CHART','group' : ''},
      'inv_cred':{'literal':'Inversión crediticia','typeChart': 'LINE_CHART','group' : ''},
      'depos_clientes':{'literal':'Depósitos de clientes','typeChart': 'LINE_CHART','group' : ''},
      'activos_totales':{'literal':'Activos totales / fondos propios','typeChart': 'LINE_CHART','group' : ''},
      'inv_cred_fon_prop':{'literal':'Inversión crediticia / fondos propios','typeChart': 'LINE_CHART','group' : ''},
      'inv_cred_dep_cli':{'literal':'Inversión crediticia / depósitos de clientes','typeChart': 'LINE_CHART','group' : ''},
      'tasa_morosidad':{'literal':'Tasa de morosidad','typeChart': 'LINE_CHART','group' : ''},
      'cobertura_morosidad':{'literal':'Cobertura de la morosidad','typeChart': 'LINE_CHART','group' : ''},
      'ratio_eficiencia':{'literal':'Ratio de eficiencia','typeChart': 'LINE_CHART','group' : ''},
      'core_capital':{'literal':'Core Capital','typeChart': 'LINE_CHART','group' : ''},
      'tier_1':{'literal':'Tier 1','typeChart': 'LINE_CHART','group' : ''},
      'roa':{'literal':'ROA','typeChart': 'LINE_CHART','group' : ''},
      'roe':{'literal':'ROE','typeChart': 'LINE_CHART','group' : ''},
      'cash_flow_exp':{'literal':'Cash-flow de explotación','typeChart': 'LINE_CHART','group' : 'gr_cash_flow'},
      'cash_flow_inv':{'literal':'Cash-flow de inversión','typeChart': 'LINE_CHART','group' : 'gr_cash_flow'},
      'cash_flow_fin':{'literal':'Cash-flow de financiación','typeChart': 'LINE_CHART','group' : 'gr_cash_flow'},
      'var_tip_cambio':{'literal':'Variación tipos cambio','typeChart': 'LINE_CHART','group' : ''},
      'cash_flow_neto':{'literal':'Cash-flow neto','typeChart': 'LINE_CHART','group' : 'gr_cash_flow'},
      'cfe_cfi':{'literal':'CFE-CFI','typeChart': 'LINE_CHART','group' : ''},
      'pago_dividendo':{'literal':'Pago por dividendos','typeChart': 'LINE_CHART','group' : ''},
      'num_acc_31_dic':{'literal':'Nº acciones a 31 de Diciembre','typeChart': 'LINE_CHART','group' : ''},
      'cot_max':{'literal':'Cotización máxima','typeChart': 'LINE_CHART','group' : 'gr_cot'},
      'cot_min':{'literal':'Cotización mínima','typeChart': 'LINE_CHART','group' : 'gr_cot'},
      'per_max':{'literal':'PER máximo','typeChart': 'LINE_CHART','group' : 'gr_per'},
      'per_min':{'literal':'PER mínimo','typeChart': 'LINE_CHART','group' : 'gr_per'},
      'rd_max':{'literal':'RD% máxima','typeChart': 'LINE_CHART','group' : 'gr_rd'},
      'rd_media':{'literal':'RD% media','typeChart': 'LINE_CHART','group' : 'gr_rd'},
      'rd_min':{'literal':'RD% mínima','typeChart': 'LINE_CHART','group' : 'gr_rd'},
      'pre_val_con_max':{'literal':'Precio / Valor contable máximo','typeChart': 'LINE_CHART','group' : 'gr_pre_val_con'},
      'pre_val_con_medio':{'literal':'Precio / Valor contable medio','typeChart': 'LINE_CHART','group' : 'gr_pre_val_con'},
      'pre_val_con_min':{'literal':'Precio / Valor contable mínimo','typeChart': 'LINE_CHART','group' : 'gr_pre_val_con'},
      'ev_ebitda_medio':{'literal':'EV / EBITDA medio','typeChart': 'LINE_CHART','group' : ''},
      'ev_ebit_medio':{'literal':'EV /EBIT medio','typeChart': 'LINE_CHART','group' : 'gr_ev_ebitda'},
      'roce_medio':{'literal':'ROCE medio','typeChart': 'LINE_CHART','group' : ''},
      'margen_ebitda_ventas':{'literal':'Margen EBITDA / Ventas','typeChart': 'LINE_CHART','group' : ''},
      'margen_ebit_ventas':{'literal':'Margen EBIT / Ventas','typeChart': 'LINE_CHART','group' : ''},
      'deuda_neta':{'literal':'Deuda neta','typeChart': 'LINE_CHART','group' : ''},
      'deuda_neta_ebitda':{'literal':'Deuda neta / EBITDA','typeChart': 'LINE_CHART','group' : ''},
      'deuda_neta_cf_explo':{'literal':'Deuda neta / CF EXplotación','typeChart': 'LINE_CHART','group' : ''},
      'roce':{'literal':'ROCE','typeChart': 'LINE_CHART','group' : ''},
      'cfe_cfi_pid':{'literal':'CFE-CFI-PID','typeChart': 'LINE_CHART','group' : ''},
      'ev_ebitda_max':{'literal':'EV / EBITDA máximo','typeChart': 'LINE_CHART','group' : 'gr_ev_ebitda'},
      'ev_ebitda_med':{'literal':'EV / EBITDA medio','typeChart': 'LINE_CHART','group' : 'gr_ev_ebitda'},
      'ev_ebitda_min':{'literal':'EV / EBITDA mínimo','typeChart': 'LINE_CHART','group' : 'gr_ev_ebitda'},
      'ebit_ope_profit':{'literal':'EBIT (Operating profit)','typeChart': 'LINE_CHART','group' : ''},
      'coste_ventas':{'literal':'Coste de ventas','typeChart': 'LINE_CHART','group' : ''},
      'coti_dolares':{'literal':'Cotización en dólares','typeChart': 'LINE_CHART','group' : ''},
      'rd__maxima':{'literal':'RD%  máxima','typeChart': 'LINE_CHART','group' : 'gr_rd'},
      'coti_libras':{'literal':'Cotización en libras','typeChart': 'LINE_CHART','group' : ''},
      'primas':{'literal':'Primas','typeChart': 'LINE_CHART','group' : ''},
      'ratio_combinado':{'literal':'Ratio combinado','typeChart': 'LINE_CHART','group' : ''},
      'ingresos_totales':{'literal':'Ingresos totales','typeChart': 'LINE_CHART','group' : ''},
      'otros_ingresos':{'literal':'Otros ingresos','typeChart': 'LINE_CHART','group' : ''}

    };
    //console.log(arrHeadersConfig)
    return arrHeadersConfig;
  }

  translateHeader(key) {
    if (key != null) {
      if (key.substring(key.length-4) == '_por') {
        newkey = key.substring(0, key.length-4)
        strPercent = " %"
      } else {
        newkey = key
        strPercent = ""
      }

      eleHeader = this.arrHeaders[newkey];
      if (eleHeader != null ) {
        return eleHeader["literal"] + strPercent;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  getTypeChart(key) {
    if (key != null) {
      if (key.substring(key.length-4) == '_por') {
        newkey = key.substring(0, key.length-4)
      } else {
        newkey = key
      }

      eleHeader = this.arrHeaders[newkey];
      if (eleHeader != null ) {
        return eleHeader["typeChart"];
      } else {
        return "BAR_CHART";
      }
    } else {
      return "BAR_CHART";
    }
  }

  getGroupElement(key) {
    eleHeader = this.arrHeaders[key];
    if (eleHeader != null ) {
      return eleHeader["group"];
    } else {
      return "";
    }
  }


  /**
  * Renderiza la información del bloque Info General de la empresas
  */
  renderInfoGeneral(strTitle, strValue) {
    //console.log("Init: renderInfoGeneral")

    if ((strTitle != null) &&
        (strTitle != undefined) &&
        (strValue != null) &&
        (strValue != undefined))
    {
      var returnValue = [];

      returnValue.push(
        <View key={strTitle} style={stylesGen.viewCard}>
          <Text style={stylesGen.textViewCardIzq}>{this.translateHeader(strTitle)}</Text>
          <Text style={stylesGen.textViewCardDer}>{strValue}</Text>
        </View>
      );

      var keyDiv = "divider" + strTitle;

      returnValue.push(
        <Divider key={keyDiv} style={stylesGen.divider}/>
      );
      //console.log("Fin: renderInfoGeneral")
      return returnValue
    } else {
      return null
    }
  }

  /**
  * Renderiza la información del bloque Estimación de la empresas
  */
  renderEstimacion(objEstimaciones) {
    //console.log("Init: renderEstimacion")
    if ((objEstimaciones != null) &&
        (objEstimaciones != undefined))
    {
      if ((objEstimaciones.header != null) &&
          (objEstimaciones.header != undefined))
      {

        var returnValue = [];
        if (objEstimaciones.header.length == 1) {
          keyObjEst = "objEst" + objEstimaciones.header[0];
          keyObjEstDiv = "objEstDiv" + objEstimaciones.header[0];

          returnValue.push(
            <View key={keyObjEst} style={stylesGen.viewCard}>
              <Text style={stylesGen.textViewCardIzq}></Text>
              <Text style={stylesGen.textViewCardDer}>{objEstimaciones.header[0]}</Text>
            </View>
          );
          returnValue.push(
            <Divider key={keyObjEstDiv} style={stylesGen.divider}/>
          );

          for (element in objEstimaciones.datos) {
            keyObjEst = "objEst" + this.translateHeader(element);
            keyObjEstDiv = "objEstDiv" + this.translateHeader(element);

            returnValue.push(
              <View key={keyObjEst} style={stylesGen.viewCard}>
                <Text style={stylesGen.textViewCardIzq}>{this.translateHeader(element)}</Text>
                <Text style={stylesGen.textViewCardDer}>{objEstimaciones.datos[element][0]}</Text>
              </View>
            );
            returnValue.push(
              <Divider key={keyObjEstDiv} style={stylesGen.divider}/>
            );
          }

        }

        if (objEstimaciones.header.length == 2) {
          keyObjEst = "objEst" + objEstimaciones.header[0];
          keyObjEstDiv = "objEstDiv" + objEstimaciones.header[0];

          returnValue.push(
            <View key={keyObjEst} style={stylesGen.viewCard}>
              <Text style={stylesGen.textViewCardIzq}></Text>
              <Text style={stylesGen.textViewCardDer}>{objEstimaciones.header[0]}</Text>
              <Text style={stylesGen.textViewCardDer}>{objEstimaciones.header[1]}</Text>
            </View>
          );
          returnValue.push(
            <Divider key={keyObjEstDiv} style={stylesGen.divider}/>
          );

          for (element in objEstimaciones.datos) {
            keyObjEst = "objEst" + this.translateHeader(element);
            keyObjEstDiv = "objEstDiv" + this.translateHeader(element);

            returnValue.push(
              <View key={keyObjEst} style={stylesGen.viewCard}>
                <Text style={stylesGen.textViewCardIzq}>{this.translateHeader(element)}</Text>
                <Text style={stylesGen.textViewCardDer}>{objEstimaciones.datos[element][0]}</Text>
                <Text style={stylesGen.textViewCardDer}>{objEstimaciones.datos[element][1]}</Text>
              </View>
            );
            returnValue.push(
              <Divider key={keyObjEstDiv} style={stylesGen.divider}/>
            );
          }

        }

        //console.log("Fin: renderEstimacion")
        return returnValue
        //return null
      } else {
        return null
      }
    } else {
      return null
    }
  }

  /*
  *
    Valida que tiene datos validos el array
    ( para después no mostrar gráficos vacios)
  */
  isValidData(arrData) {
    if (arrData.length > 0) {
      //console.log(arrData)

      blnAllZero = true
      for (i=0;i<arrData.length;i++) {
        if (arrData[i] != 0) {
          blnAllZero = false;
          //console.log(arrData[i]+" - false")
          break;
        }
      }

      if (blnAllZero) {
        return false;
      } else {
        return true;
      }

    } else {
      return false;
    }
  }

  renderDatos(objDatos, strForceChartType) {
    //console.log("Init: renderDatos")
    if ((objDatos != null) &&
        (objDatos != undefined))
    {
      var returnValue = [];

      for (element in objDatos.datos) {

        var headerInfo = [];
        var dataSets = [];
        var arrSet = [];
        var dataInfo = [];

        for (elementData in objDatos.datos[element]) {
          elementFloat = parseFloat(objDatos.datos[element][elementData].replace(/,/, '.'));
          if (!isNaN(elementFloat)) {

            if (objDatos.header[elementData] != undefined) {
              dataInfo.push(parseFloat(elementFloat));
              //headerInfo.push(this.decode(this.entities.decode(this.wtf8.decode(objDatos.header[elementData]))));
              headerInfo.push(this.util.decodeData(objDatos.header[elementData]));
            }

          }
        }

        if (this.isValidData(dataInfo)) {
          arrSet= { data: dataInfo};
          dataSets.push(arrSet);
          returnValue.push(this.renderChart(headerInfo, dataSets, strForceChartType));
        }
      }

      //console.log("Fin: renderDatos")
      return returnValue;
    }
  }


  renderChart(headerInfo, dataSets, strForceChartType) {
    var returnValue = [];

    const chartConfig = {
      /*backgroundColor: '#09629C',
      backgroundGradientFrom: '#09629C',
      backgroundGradientTo: '#082E5B',*/
      backgroundColor: '#FFFFFF',
      backgroundGradientFrom: '#FFFFFF',
      backgroundGradientTo: '#FFFFFF',
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      //color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    }
    const screenWidth = Dimensions.get('window').width;

    if (strForceChartType == "") {
        strTypeChart = this.getTypeChart(element)
    } else {
        strTypeChart = strForceChartType
    }

    var datosGraf = null;
    datosGraf = {
      labels: headerInfo,
      datasets: dataSets,
      title: this.translateHeader(element),
      typeChart: strTypeChart
      /*datasets: [{
        data: dataInfo
      }]*/
    }

    returnValue.push(datosGraf)
    return returnValue

    keyDiv= "divi"+this.translateHeader(element);
    keyChart = "chrt"+this.translateHeader(element);

    returnValue.push(
      <Text key={this.translateHeader(element)} style={stylesGen.titleGraf}>{this.translateHeader(element)}</Text>
    )


    switch (strTypeChart) {
      case "BAR_CHART":
        returnValue.push(
          <BarChart
            key={keyChart}
            style={{ borderRadius: 16, overflow: 'hidden' }}
            data={datosGraf}
            width={screenWidth-50}
            height={200}
            chartConfig={chartConfig}
          />
        );
        break;

      case "LINE_CHART":
        returnValue.push(
          <LineChartManu
            key={keyChart}
            style={{ borderRadius: 16, overflow: 'hidden' }}
            data={datosGraf}
            width={screenWidth-50}
            height={200}
            chartConfig={chartConfig}
          />
        );
        break;

    }

    returnValue.push(
      <Divider key={keyDiv} style={stylesGen.divider}/>
    );

    return returnValue;

  }

renderPrevisiones(data, dataAnt) {
    //console.log("Init: renderPrevisiones")
    var returnValue = [];
    if ((data != null) || (dataAnt != null)) {
      returnValue.push(
        <Text key="AnaTri" style={stylesGen.titleObs}>Análisis trimestrales</Text>
      )
    }
    if (data != null) {
      for (i=0; i < data.length; i++) {
        if (data[i] != "") {
          numI = i.toString();
          keyVal = "Previ" + numI;
          keyValDiv = "PreviDiv" + numI;
          returnValue.push(
            <Text key={keyVal} style={stylesGen.textObs}>{this.util.decodeData(data[i])}</Text>
          )
          returnValue.push(
            <Divider key={keyValDiv} style={stylesGen.divider}/>
          );
        }
      }
    }
    if (dataAnt != null) {
        returnValue.push(this.renderPrevisionesAnteriores(dataAnt))
    }

    //console.log("Fin: renderPrevisiones")
    return returnValue;
}

renderPrevisionesAnteriores(data) {
  //console.log("Init: renderPrevisionesAnteriores")
  var returnValue = [];
  if ((data != null) && (data.header != null)) {
    if (data.header.length > 0) {
      for (i=0; i < data.datos.length; i++) {
        if (data.datos[i] != "") {
          returnValue.push(
              <Text style={stylesGen.textObs}>{this.util.decodeData(data.datos[i])}</Text>
          )
          returnValue.push(
            <Divider style={stylesGen.divider}/>
          );
        }
      }
    }
  }
  //console.log("Fin: renderPrevisionesAnteriores")
  return returnValue;
}

renderObservacionesDetall(data, header) {
    //console.log("Init: renderObservacionesDetall")
    var returnValue = [];

    if (data.length > 0) {
      returnValue.push(
        <Text key="idComGen" style={stylesGen.titleObs}>Comentarios generales</Text>
      )
    }

    for (i = 0; i < data.length; i++) {
      if (data[i] != "") {
        numI = i.toString();
        keyVal = "Observ" + numI;
        keyVal2 = "Observ2" + numI;
        keyValDiv = "ObservDiv" + numI;

        returnValue.push(
          <Text key={keyVal} style={stylesGen.titleObs}>{header[i]}</Text>
        )
        returnValue.push(
            <Text key={keyVal2} style={stylesGen.textObs}>{data[i].substring(15)}</Text>
        )
        returnValue.push(
          <Divider key={keyValDiv} style={stylesGen.divider}/>
        );
      }
    }
    //console.log("Fin: renderObservacionesDetall")
    return returnValue;
}



renderObservaciones(objDatos, objPrevision, objDatosAnt) {
  //console.log("Init: renderObservaciones")
  if ((objDatos != null) &&
      (objDatos != undefined))
  {
    var returnValue = [];
    const obs_Img = require('../../images/empresa_4_4.jpg');

    for (element in objDatos.datos) {
      var blnPrintObservaciones = false;
      var headerInfo = [];
      var dataSets = [];
      var arrSet = [];
      var dataInfo = [];

      if (element == 'observaciones') {
        for (elementData in objDatos.datos[element]) {
          if (objDatos.header[elementData] != undefined) {
            if ((objDatos.datos[element][elementData] != "") && (objDatos.datos[element][elementData] != "&nbsp;")) {
              blnPrintObservaciones = true;
              dataInfo.push(this.util.decodeData(objDatos.datos[element][elementData]));
              headerInfo.push(this.util.decodeData(objDatos.header[elementData]));
            }
          }
        }
        break;
      }

    }

    //if (blnPrintObservaciones) {
      returnValue.push(
        <Card
          key="Observaciones"
          featuredTitle      ="Observaciones"
          featuredTitleStyle ={stylesGen.featuredTitleStyle}
          containerStyle     ={stylesGen.cardGeneral}
          image={obs_Img}
          >
          {this.renderPrevisiones(objPrevision, objDatosAnt)}
          {this.renderObservacionesDetall(dataInfo, headerInfo)}
        </Card>
      );
    //}

    //console.log("Fin: renderObservaciones")
    return returnValue;
  }


}

renderListItemData(key, titleList, naviScreen, arrData, titlePress, typePress) {

  if (arrData.length > 0) {
    return (<ListItem
        containerStyle={styles.listContainerItem}
        key={key}
        title={titleList}
        onPress={() => this.props.navigation.navigate(naviScreen,{
          datos: arrData,
          title: titlePress,
          tipo: typePress
        })}
      />
    );
  } else {
    return null;
  }
}





render() {

    if ((this.state.loading) || (this.state.empresa.length == 0)) {
        return (
          <Container style={stylesGen.generalContainer}>
            <Content>
              <ActivityIndicator style={stylesGen.ActivityIndicator} animating size="large" />
              <DropdownAlert
                ref={ref => this.dropdown = ref}
                onClose={data => this.onClose(data)} />
            </Content>
          </Container>
        )

    } else {

      const {
        ticker,
        cotizacion,
        num_acciones,
        capitalizacion,
        val_contable_accion,
        precio_val_cont,
        ev_ebitda,
        ev_ebit
      } = this.state.empresa.info_general.datos;

      const defaultImg = require('../../images/foroIndex_0.jpg');

      const empresa1_Img = require('../../images/empresa_1_1.jpg');
      const empresa2_Img = require('../../images/empresa_2_2.jpg');
      const empresa3_Img = require('../../images/eempresa_2_2.jpg');
      const empresa4_Img = require('../../images/empresa_4_4.jpg');
      const empresa5_Img = require('../../images/eempresa_3_3.jpg');


      let arrTasCre = this.renderDatos(this.state.empresa.tasas_crecimiento, 'BAR_CHART');
      let arrRatMed = this.renderDatos(this.state.empresa.ratios_medios, 'BAR_CHART');
      let arrDatHis = this.renderDatos(this.state.empresa.datos_historicos, '');

      return (
        <Container style={stylesGen.generalContainer}>
          <Content>
            <Card
              key="InfoG"
              featuredTitle      ="Información General"
              featuredTitleStyle ={stylesGen.featuredTitleStyle}
              containerStyle     ={stylesGen.cardGeneral}
              image={empresa1_Img}
              >
              {this.renderInfoGeneral('ticker', ticker)}
              {this.renderInfoGeneral('cotizacion', cotizacion)}
              {this.renderInfoGeneral('num_acciones', num_acciones)}
              {this.renderInfoGeneral('capitalizacion', capitalizacion)}
              {this.renderInfoGeneral('val_contable_accion', val_contable_accion)}
              {this.renderInfoGeneral('precio_val_cont', precio_val_cont)}
              {this.renderInfoGeneral('ev_ebitda', ev_ebitda)}
              {this.renderInfoGeneral('ev_ebit', ev_ebit)}
            </Card>

            <Card
              key="Estimac"
              featuredTitle      ="Estimación"
              featuredTitleStyle ={stylesGen.featuredTitleStyle}
              containerStyle     ={stylesGen.cardGeneral}
              image={empresa2_Img}
              >
              {this.renderEstimacion(this.state.empresa.estimaciones)}
            </Card>
            <List containerStyle={styles.listContainer}>

              {this.renderListItemData('idTasCre','Tasas de crecimiento','DatosChartScreen',arrTasCre, this.state.title, 'TasasCrecimiento')}

              {this.renderListItemData('idRatMed','Ratios medios','DatosChartScreen',arrRatMed, this.state.title, 'RatiosMedios')}

              {this.renderListItemData('idDatHis','Datos históricos','DatosChartScreen',arrDatHis, this.state.title, 'DatosHistoricos')}

            </List>

            {this.renderObservaciones(this.state.empresa.datos_historicos,
                                      this.state.empresa.observaciones_act,
                                      this.state.empresa.observaciones_ant
                                    )}

          </Content>
          <AdsComponent
            subscription={this.state.subs_active}
            typeAd={"banner"}
          />
          <DropdownAlert
            ref={ref => this.dropdown = ref}
            onClose={data => this.onClose(data)} />
        </Container>
     );
   }

  }
}

const styles = {
  hello: {
    backgroundColor: '#CCC'
  },
  listContainer: {
    backgroundColor: '#f2f2f2',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderBottomColor: '#FCFCFC',
  },
  listContainerItem: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginBottom: 10,
    borderTopWidth: 0,
    borderBottomWidth: 0.2,
    borderBottomColor: '#CCCCCC',
  }

}
