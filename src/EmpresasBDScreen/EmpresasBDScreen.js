import React from "react";
import { StatusBar, View, ScrollView, Linking, ActivityIndicator } from "react-native";
import { Container, Icon, SearchBar, Text, Button, Form, Item, Picker } from "native-base";
import { getEmpresasGen } from './ApiEmpresas.js';
import globalStyles       from '../Style/dataTableStyle.js';
import stylesGen          from '../Style/styleApp.js';

import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';
import AdsComponent from '../Ads/AdsComponent.js';
import AdsIntersticial from '../Ads/AdsIntersticial.js';

import DropdownAlert from 'react-native-dropdownalert';

import {
  Cell,
  DataTable,
  Header,
  HeaderCell,
  Row
} from 'react-native-data-table';

import { ListView } from 'realm/react-native';

export default class EmpresasBDScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Info Empresas",
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
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      data: [],
      dataSource: dataSource,
      refreshing: false,
      loading: false,
      sortKey: '',
      reverseSort: false,
      indexPais: "0",
      indexSector: "0",
      //rowImpar: true,
      usuario: null
    };
    this.rowImpar= true;
    this.unfilteredData = null;
    this.renderHeader   = this.renderHeader.bind(this);
    this.renderRow      = this.renderRow.bind(this);

    this.util = new Utils();

    this.analytics = new Analytics();
    this.analytics.trackScreenView("EmpresasScreen");
  }

  async componentDidMount() {
    this.setState({ loading: true });

    const infoAuth = this.util.getAuthInfo(this);
    const valAu = await infoAuth;
    const infoResult = this.util.getSubscriptionInfo(this);
    const valRes = await infoResult;

    //if (this.state.subs_active == "1") {
      if (this.state.usuario != null) {
          this.ads = new AdsIntersticial(this.state.subs_active, 5, this);
          this.setState({ loading: false });
          this.getEmpresasGen();
      } else {
        this.setState({ loading: false });
        this.onError("Introduce la información de login");
      }
    //} else {
    //  this.setState({ loading: false });
    //  this.onError("Para acceder al contenido es necesario tener una suscripción activa");
    //}
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

  getEmpresasGen() {
    if (!this.state.loading) {
      this.setState({
        loading: true
      }, () => {
        this.analytics.trackEvent("EmpresasScreen", "Carga Empresas Gen");

        getEmpresasGen(
          this.state.indexPais,
          this.state.indexSector
        )
          .then(data => this.setState({
            data,
            refreshing: false,
            loading: false
            //dataSource: this.state.dataSource.cloneWithRows(data.datos_empresa),
          },() =>{
            this.setDataSource();
            //this.orderColumn(this.state.sortKey);
          }))
          .catch(() => this.setState({ refreshing: false, loading: false }));
        }
      );



    }
  }

  renderLoading =() => {
    if ((!this.state.loading) || (this.state.loading && this.state.refreshing)) {
      return null;
    } else {
      return (
        <ActivityIndicator style={stylesGen.ActivityIndicator} animating size="large" />
      );
    }
  }

  setDataSource () {
    //console.log(this.state.data.datos_empresa);
    if (this.state.data.datos_empresa != undefined) {
      //console.log("dentro");
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.state.data.datos_empresa),
      },() =>{
        this.orderColumn(this.state.sortKey);
      });
    } else {
      //console.log("else");
      nothing = "";
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nothing),
      });
    }
  }


  orderColumn(key) {
    var blnReverseSort = !this.state.reverseSort;
    var arraySort = require('array-sort');
    arrDatosEmpresas = this.state.data.datos_empresa;

    arrDatosEmpresas = arraySort(arrDatosEmpresas, key, {reverse: this.state.reverseSort});

    datos = this.state.data;
    datos.datos_empresa = arrDatosEmpresas;

    this.setState({
      data : datos,
      dataSource: this.state.dataSource.cloneWithRows(datos.datos_empresa),
      sortKey: key,
      reverseSort : blnReverseSort
    });
    this.ads.showIntersticialAd();
  }


  translateHeader(key) {
    let arrLiteral = {
      'empresa':'Empresa',
      'cotizacion':'Cotización',
      'dividendo':'Dividendo',
      'rd':'Rd',
      'bpaord':'BPA Ord.',
      'per':'PER',
      'vca':'VCA',
      'pvc':'P/VC'
    }
    return arrLiteral[key];
  }

  renderIconHeader(key) {

    if (key == this.state.sortKey) {
      if (this.state.reverseSort) {
        return <Icon name="arrow-up" style={{position: 'absolute', right: -20}}/>
      } else {
        return <Icon name="arrow-down" style={{position: 'absolute', right: -20}}/>
      }
    } else {
      return null
    }
  }

  renderHeader() {
    //console.log("renderHeader")
    if (!this.state.loading) {

      const headerCells = [];

      if (this.state.data.datos_empresa && this.state.data.datos_empresa.length > 0) {
        const firstObject = this.state.data.datos_empresa[0];

        for (const [key] of Object.entries(firstObject)) {
          if (key != 'EmpresaLink') {
            headerCells.push(

              <Cell
                key={key}
                style={globalStyles.headerCell}
                textStyle={globalStyles.text}
                width={1}
              >
                <Button transparent
                  onPress={ ()=>{ this.orderColumn(key)}}>
                  <Text style={globalStyles.button3}>{this.translateHeader(key)}</Text>
                  {this.renderIconHeader(key)}
                </Button>
              </Cell>
            );
          }
        }
      }
      return (
        <Header style={globalStyles.header}>
          {headerCells}
        </Header>
      );
    } else {
      return null;
    }
  }

  renderRow(item) {
    //console.log("renderRow")
    //console.log(item)
    if (!this.state.loading) {

      const cells = [];
      if (this.state.data.datos_empresa && this.state.data.datos_empresa.length > 0) {

        const firstObject = this.state.data.datos_empresa[0];
        for (const [key] of Object.entries(firstObject)) {
          let itemString = item[key]
            && ((typeof item[key] === 'string')
            || (typeof item[key] === 'number')
            || (typeof item[key].getMonth === 'function'))
            && String(item[key]);
          if (!itemString && item[key] && item[key].length) itemString = item[key].length;
          if (typeof item[key] === 'boolean') itemString = item[key] ? 'True' : 'False';
          if (!itemString && item[key] && item[key].id) itemString = item[key].id;

          if (key != 'EmpresaLink') {
            if (key == 'empresa') {
              itemString = this.util.decodeData(itemString);

              cells.push(
                <Cell
                  key={key}
                  style={globalStyles.cell}
                  textStyle={globalStyles.text}
                  width={1}
                >
                  <Button transparent
                    onPress={() => this.props.navigation.navigate("DetalleEmpresasScreen",{
                      urlEmpresa: 'https://www.invertirenbolsa.info/'+item['EmpresaLink'],
                      title: itemString
                    })}
                  ><Text style={globalStyles.button2}>{itemString}</Text></Button>
                </Cell>
              );
            } else {
              cells.push(
                <Cell
                  key={key}
                  style={globalStyles.cell}
                  textStyle={globalStyles.text}
                  width={1}
                ><Text>{itemString}</Text>
                </Cell>
              );
            }
          }
        }
      }

      this.rowImpar = !this.rowImpar;

      if (this.rowImpar) {
        return (
          <Row style={globalStyles.rowImpar}>
            {cells}
          </Row>
        );
      } else {
        return (
          <Row style={globalStyles.rowPar}>
            {cells}
          </Row>
        );
      }
    } else {
      return null;
    }


  }

  onValueChangePais(value) {
    this.setState({
      indexPais: value
    },
    () =>{
        this.getEmpresasGen(),
        this.ads.showIntersticialAd()
    }
  );
  }

  onValueChangeSector(value) {
    this.setState({
      indexSector: value
    },
      () =>{
          this.getEmpresasGen(),
          this.ads.showIntersticialAd()
      }
    );
  }

  renderPickerPais = () => {
    if (this.state.data.paises != undefined) {
      let arrPaises = this.state.data.paises;
      return (
        arrPaises.map(item => <Picker.Item key={item.value} label={this.util.decodeData(item.pais)} value={item.value} />)
      )
    }
  }

  renderPickerSector = () => {
    if (this.state.data.sectores != undefined) {
      let arrSectores = this.state.data.sectores;
      return (
        arrSectores.map(item => <Picker.Item key={item.value} label={this.util.decodeData(item.sector)} value={item.value} />)
      )
    }
  }

  renderDataTable = () => {
    if (this.state.data.datos_empresa && this.state.data.datos_empresa.length > 0) {
      return(
        <ScrollView horizontal>
            <View style={[globalStyles.container]}
                  horizontal={true}>
             <DataTable
               dataSource={this.state.dataSource}
               renderRow={this.renderRow}
               renderHeader={this.renderHeader}
             />
           </View>
       </ScrollView>
      )
    } else {
      return null;
    }

  }

  render() {
    if (this.state.usuario != null) {

      return (
        <Container style={stylesGen.generalContainer}>
          <Form style={styles.ViewView}>
            <View style={{height: 100}}>
              <Item picker style={styles.ItemPicker}>
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
              <Item picker style={styles.ItemPicker}>
                <Text style={styles.textPicker}>Sector:</Text>
                <Picker
                  mode="dropdown"
                  headerBackButtonText="Atras"
                  iosHeader="Empresas"
                  iosIcon={<Icon name="ios-arrow-down-outline" />}
                  style={styles.PickerObj}
                  placeholder="Selecciona el sector"
                  placeholderStyle={{ color: "#999999"}}
                  textStyle={styles.TextSelectedPicker}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.indexSector}
                  onValueChange={this.onValueChangeSector.bind(this)}
                >
                  {this.renderPickerSector()}
                </Picker>
              </Item>
            </View>
            {this.renderLoading()}
            {this.renderDataTable()}
          </Form>
          <AdsComponent
            subscription={this.state.subs_active}
            typeAd={"banner"}
          />
       </Container>
     );
   } else {
     return (
       <Container style={stylesGen.generalContainer}>
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
