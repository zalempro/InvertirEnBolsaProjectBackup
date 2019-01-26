import React from 'react';
import { Dimensions } from 'react-native';

import {
  AdMobBanner
} from 'expo';

export default class AdsComponent extends React.Component {

  constructor(props) {
      super(props);

      var {height, width} = Dimensions.get('window');
      this.height = height;
      this.width = width;

      this.typeAd = this.props.typeAd;
      console.log("ENTORNO: ", process.env.NODE_ENV)
      if(process.env.NODE_ENV === 'development') {
        this.bannerId = "ca-app-pub-3940256099942544/2934735716";
      } else {
        if (Platform.OS==="ios") {
          this.bannerId = "ca-app-pub-8709699541706246/8923060028";
        } else {
          this.bannerId = "ca-app-pub-8709699541706246/9794294154";
        }
      }


      this.blnShowAds = true;
      //console.log("Banner subscription:",this.props.subscription)
      if ((this.props.subscription != undefined) && (this.props.subscription == '1')) {
        this.blnShowAds = false;
      }
  }

  shouldComponentUpdate(newProps) {
    if (this.props.subscription !== newProps.subscription) {
      if ((newProps.subscription != undefined) && (newProps.subscription == '1')) {
        this.blnShowAds = false;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  renderBanner() {
    if (this.blnShowAds) {
      if ((this.props.bannerSize == "") || (this.props.bannerSize == undefined)){
          if (this.height >= 1000) {
            strBannerSize = "largeBanner";
          } else if (this.height >= 600) {
            strBannerSize = "largeBanner";
          } else {
            strBannerSize = "banner";
          }
      } else {
          strBannerSize = this.props.bannerSize;
      }

      return(
        <AdMobBanner
          style={styles.bottomBanner}
          bannerSize={strBannerSize}
          adUnitID={this.bannerId} // Test ID, Replace with your-admob-unit-id
          //testDeviceID="EMULATOR"
          onDidFailToReceiveAdWithError={(bannerError) => { console.log("ERR:",bannerError)}} />
      );
    } else {
      return(null);
    }
  }

  render() {
    switch (this.typeAd) {
      case "banner":
        return(this.renderBanner())
        break;

      default:
        return (null);
    }

  }
}

const styles = {
  bottomBanner: {
      marginTop: 5,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center'
  }
};
