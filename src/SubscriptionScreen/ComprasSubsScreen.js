import React from "react";

import { View, ScrollView, Image, Text, Platform, Alert, ActivityIndicator,
Linking, FlatList} from "react-native";

import { Button, Icon } from "native-base";
import { Card, Divider, Button as ButtonEle, List, ListItem} from "react-native-elements";
import stylesGen from '../Style/styleApp.js';

import Utils from '../Utils/Utils.js';
import Analytics from '../Utils/Analytics.js';


export default class ComprasSubsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Compras Realizadas",
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
      //latest_receipt_info: this.props.navigation.getParam('lista', ''),
      latest_receipt_info: _.sortBy( this.props.navigation.getParam('lista', ''), 'expires_date_ms' ).reverse(),
      loading: false
    };

    this.analytics = new Analytics();
    this.analytics.trackScreenView("ComprasSubsScreen");
  }


  async componentDidMount() {
    this.setState({ loading: true });

    this.setState({ loading: false });
  }



  renderRowHistoricoCompras ({ item }) {
    strTitle = "";
    switch (item.product_id) {
      case "ieb.info.subs.mensual":
        strTitle = "Suscripción Mensual";
        break;
      case "ieb.info.subs.semestral":
        strTitle = "Suscripción Semestral"
        break;
      case "ieb.info.subs.anual":
          strTitle = "Suscripción Anual"
          break;
    }

    strExpireDate = new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(item.expires_date_ms);
    strStartDate = new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(item.purchase_date_ms);
    strDate = "Fecha Fin: " + strExpireDate + "\n" + "Fecha Ini.: "+ strStartDate;

    return (
      <ListItem
        key={item.transaction_id}
        hideChevron
        subtitleNumberOfLines={2}
        title={strTitle}
        titleStyle={styles.titleSty}
        subtitle={strDate}
        subtitleStyle={styles.subtitle}
        leftIcon={{name: "payment"}}
      />
    )
  }

  renderHistoricoCompras () {
    if (this.state.latest_receipt_info != null) {
      return (
        <List>
          <FlatList
            data={this.state.latest_receipt_info}
            renderItem={this.renderRowHistoricoCompras}
            keyExtractor={item => item.transaction_id}
          />
        </List>
      )
    } else {
      return (null)
    }
  }

  render() {

      if (this.state.loading) {
        return <ActivityIndicator style={stylesGen.ActivityIndicator} size="large" />
      } else {
        if (this.state.latest_receipt_info) {
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
                  {this.renderHistoricoCompras()}
                </ScrollView>
            );

        } else {
          return null;
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
  titleSty: {
    fontSize: 14,
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 14
  }
}
