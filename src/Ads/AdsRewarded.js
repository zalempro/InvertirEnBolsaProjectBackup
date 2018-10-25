import React from 'react';
import { Platform, Icon } from 'react-native';
import { Button } from "react-native-elements";

import { AdMobRewarded } from 'expo';
import Utils from '../Utils/Utils.js';

export default class AdsRewarded extends React.Component {

  constructor(props) {
      super(props);

      console.log("ENTORNO: ", process.env.NODE_ENV)
      if(process.env.NODE_ENV === 'development') {
        this.adBonificadoId = "ca-app-pub-3940256099942544/5224354917";
      } else {
        if (Platform.OS==="ios") {
          this.adBonificadoId = "ca-app-pub-8709699541706246/1687840907";
        } else {
          this.adBonificadoId = "ca-app-pub-8709699541706246/6732693146";
        }
      }

      AdMobRewarded.setAdUnitID(this.adBonificadoId); // Test ID, Replace with your-admob-unit-id
      AdMobRewarded.setTestDeviceID('EMULATOR');

      this.util = new Utils();
      this.blnBloq = false;
      this.blnLoadedRewarded = false;


      AdMobRewarded.addEventListener("rewardedVideoDidFailToLoad", () => {
          if (this.blnBloq) {
            this.blnLoadedRewarded = false;
            this.blnBloq = false;
            //console.log("rewardedVideoDidFailToLoad");
            //this.showSimpleBonificadoAd();
          }
        }
      );

      AdMobRewarded.addEventListener("rewardedVideoDidLoad", () => {
          this.blnLoadedRewarded = true;
        }
      );

      /*if (Platform.OS!=="ios") {
        AdMobRewarded.addEventListener("rewardedVideoDidComplete", () => {
            if (this.props.subs_expiresDateSub != undefined) {
              //console.log("rewardedVideoDidComplete");
              this.util.addMinutsSubscription(this.props.subs_expiresDateSub, 2);
            }
          }
        );
      }*/

      AdMobRewarded.addEventListener("rewardedVideoDidClose", () => {
          //console.log("rewardedVideoDidClose");
          if (this.blnBloq) {
            //console.log("rewardedVideoDidClose");
            this.blnBloq = false;
            this.loadAdmodRewarded();
          }
        }
      );

      AdMobRewarded.addEventListener("rewardedVideoWillLeaveApplication", () => {
           if (this.blnBloq) {
              //console.log("In rewardedVideoWillLeaveApplication")
              //if (this.props.subs_expiresDateSub != undefined) {
                //this.blnBloq = false;
                this.util.addMinutsSubscription(this.props.subs_expiresDateSub, 1440);
                this.loadAdmodRewarded();
                this.props.onResponseFunction("24 horas de bonificación");
              //}
            }
          }
      );

      AdMobRewarded.addEventListener("rewardedVideoDidRewardUser", () => {
          //if (this.props.subs_expiresDateSub != undefined) {
            //console.log("rewardedVideoDidRewardUser");
            this.util.addMinutsSubscription(this.props.subs_expiresDateSub, 30);
            this.loadAdmodRewarded();
            this.props.onResponseFunction("30 minutos de bonificación");
          //}
        }
      );

      AdMobRewarded.addEventListener("rewardedVideoDidOpen", () => {
             //this.util.addMinutsSubscription(this.props.subs_expiresDateSub, 5);
        }
      );
  }

  componentDidMount() {
    this.loadAdmodRewarded();
  }

  loadAdmodRewarded() {
    this.blnBloq = true;
    this.blnLoadedRewarded = false;
    //console.log("En compo: ",this.props.subs_expiresDateSub);
    AdMobRewarded.requestAdAsync();
  }

  lanzarAnuncioBonificado() {
    if (!this.blnBloq & !this.blnLoadedRewarded) {
       this.loadAdmodRewarded();
    }
    AdMobRewarded.showAdAsync();
  }

  shouldComponentUpdate(newProps) {
    //console.log("shouldComponentUpdate")
    if (this.props.subs_expiresDateSub !== newProps.subs_expiresDateSub) {
      if (newProps.subs_expiresDateSub != undefined)  {
        //this.blnShowAds = false;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  render() {
    return(
      <Button
      leftIcon={{name: 'subscriptions'}}
      title='Ver Anuncio Bonificado'
      buttonStyle={{
        backgroundColor: "#0099ff",
        flex: 1,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 5,
        marginTop: 25,
        marginBottom: 25
      }}
        onPress={() => {this.lanzarAnuncioBonificado()}}
      />
    );

  }
}

const styles = {
  bottomBanner: {
      marginTop: 0,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center'
  }
};
