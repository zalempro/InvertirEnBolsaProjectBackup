import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Text, Button, Card, Divider, Slider } from 'react-native-elements';
import { Icon, Container } from "native-base";
//import {OptimizedFlatList} from 'react-native-optimized-flatlist';

import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';
import stylesGen from '../Style/styleApp.js';
import AdsComponent from '../Ads/AdsComponent.js';
import AdsIntersticial from '../Ads/AdsIntersticial.js';

import DropdownAlert from 'react-native-dropdownalert';

import {
  LineChart,
  BarChart
} from 'react-native-chart-kit';
import LineChartManu from '../Chart/LineChartManu.js';

export default class DatosChartScreen extends React.PureComponent {
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

  state = {
    value: 0,
    loading: false,
    usuario: null,
    subs_active: "0"
  };

  constructor(props) {
      super(props);
      this.util = new Utils();

      this.analytics = new Analytics();
      this.analytics.trackScreenView("DatosChartScreen");


      this.title = this.props.navigation.getParam('title', ''),
      this.tipo  = this.props.navigation.getParam('tipo', ''),
      this.datos = this.props.navigation.getParam('datos', '')

      this.empresa3_Img = require('../../images/eempresa_2_2.jpg');
      this.empresa4_Img = require('../../images/empresa_4_4.jpg');
      this.empresa5_Img = require('../../images/eempresa_3_3.jpg');

      this.screenWidth = Dimensions.get('window').width;

      this.chartConfig = {
        backgroundColor: '#FFFFFF',
        backgroundGradientFrom: '#FFFFFF',
        backgroundGradientTo: '#FFFFFF',
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      }

      this.numActionsToShowAd = 10;
      switch (this.tipo) {
        case 'TasasCrecimiento':
          this.blocTitle = 'Tasas de crecimiento';
          this.imgBloque = this.empresa5_Img;
          this.numActionsToShowAd = 10;
          this.analytics.trackEvent("DatosChartScreen", "TasasCrecimiento");
          break;

        case 'RatiosMedios':
          this.blocTitle = 'Ratios medios';
          this.imgBloque = this.empresa3_Img;
          this.numActionsToShowAd = 10;
          this.analytics.trackEvent("DatosChartScreen", "Ratios medios");
          break;

        case 'DatosHistoricos':
          this.blocTitle = 'Datos históricos';
          this.imgBloque = this.empresa4_Img;
          this.numActionsToShowAd = 50;
          this.analytics.trackEvent("DatosChartScreen", "Datos históricos");
          break;
      }

      this.objChart = null;;
      this.ads = null;

  }

  async componentDidMount() {
    this.setState({ loading: true });

    const infoAuth = this.util.getAuthInfo(this);
    const valAu = await infoAuth;

    const infoResult = this.util.getSubscriptionInfo(this);
    const valRes = await infoResult;

    //if (this.state.subs_active == "1") {
      if (this.state.usuario != null) {
          //console.log("hola!!")
          this.ads = new AdsIntersticial(this.state.subs_active, this.numActionsToShowAd, this);
          this.setState({ loading: false });
      } else {
        this.setState({ loading: false });
        this.onError("Introduce la información de login");
      }
    //} else {
    //  this.setState({ loading: false });
    //  this.onError("Para acceder al contenido es necesario tener una suscripción activa");
    //}
  }


  componentWillUnmount() {
      this.datos = null;
      //this.state = null;
      this.empresa3_Img = null;
      this.empresa4_Img = null;
      this.empresa5_Img = null;

      //console.log("WillUnmount")
  }


  renderChart() {
    this.objChart = null;

    switch (this.datos[this.state.value][0].typeChart) {
        case "BAR_CHART":
          this.objChart = (
            <BarChart
              key="BarChartkey"
              data={this.datos[this.state.value][0] }
              width={this.screenWidth-50}
              height={200}
              chartConfig={this.chartConfig}
            />
          );
          break;

        case "LINE_CHART":
          this.objChart = (
            <LineChartManu
              key="LineChartkey"
              data={this.datos[this.state.value][0] }
              width={this.screenWidth-50}
              height={200}
              chartConfig={this.chartConfig}
            />
          );
          break;

    }

    return this.objChart;
  }

  //Funciones par mostrar alert
  onError = error => {
   if (error) {
     this.dropdown.alertWithType('error', 'Error', error);
   }
  };
  onClose(data) {
   if (data.type == "error") {
       this.props.navigation.navigate("Profile");
   }
  }

  navegaLess() {
    if (this.state.value > 0) {
      this.setState({value: this.state.value - 1})
    }
  }

  navegaMore() {
    if (this.state.value < this.datos.length-1) {
      this.setState({value: this.state.value + 1})
    }
  }

  render() {
    if (this.state.usuario != null) {
      return (
        <Container style={stylesGen.generalContainer}>
          <ScrollView style={stylesGen.genView}>
            <Card
                key={this.state.tipo}
                featuredTitle      ={this.blocTitle}
                featuredTitleStyle ={stylesGen.featuredTitleStyle}
                containerStyle     ={stylesGen.cardGeneral}
                image={this.imgBloque}
                imageStyle={{height: 120}}
                >
                <Text style={stylesGen.titleGraf}>{this.datos[this.state.value][0].title}</Text>
                {this.renderChart()}
                <Slider
                  key="idSlider"
                  maximumValue={this.datos.length-1}
                  step={1}
                  value={this.state.value}
                  onValueChange={(value) => {
                    if (value != this.state.value) {
                      this.ads.showIntersticialAd();
                      this.setState({value})
                    }
                  }} />
                  <View style={styles.containerButtons}>
                    <Button
                    leftIcon={{name: 'chevron-left'}}
                    title=''
                    buttonStyle={styles.styleButtons}
                    onPress={() => this.navegaLess()}
                    />
                    <Button
                    rightIcon={{name: 'chevron-right'}}
                    title=''
                    buttonStyle={styles.styleButtons}
                    onPress={() => this.navegaMore()}
                    />
                  </View>
            </Card>
        </ScrollView>
        <AdsComponent
          subscription={this.state.subs_active}
          typeAd={"banner"}
        />
        <DropdownAlert
          ref={ref => this.dropdown = ref}
          onClose={data => this.onClose(data)} />
      </Container>

      );
    } else {
      return (
        <Container style={stylesGen.generalContainer}>
          <DropdownAlert
            ref={ref => this.dropdown = ref}
            onClose={data => this.onClose(data)} />
       </Container>
      );
    }

  }
}

const styles = {
  containerButtons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  styleButtons: {
    backgroundColor: "#0099ff",
    flex: 1,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 5,
    marginTop: 25,
    marginBottom: 25
  }

}
