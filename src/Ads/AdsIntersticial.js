import {
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from 'expo';

import Utils from '../Utils/Utils.js';
import Platform from "react-native";

export default class AdsIntersticial {
  constructor(subscription, numActionsToShow, objThis) {
    //console.log("subscription ** : ", subscription)
    this.blnBloq = false;

    this.countActionsDid = 1;
    if (numActionsToShow == undefined) {
        this.numActionsToShow = 10;
    } else {
        this.numActionsToShow = numActionsToShow;
    }

    if(process.env.NODE_ENV === 'development') {
      this.adIntersticialId = "ca-app-pub-3940256099942544/1033173712";
    } else {
      //iOS
      if (Platform.OS==="ios") {
        console.log("iOS admob")
        this.adIntersticialId = "ca-app-pub-8709699541706246/3583969400";
      } else {
        console.log("Android admob")
        this.adIntersticialId = "ca-app-pub-8709699541706246/1205782724";
      }
    }
    AdMobInterstitial.setAdUnitID(this.adIntersticialId); // Test ID, Replace with your-admob-unit-id
    AdMobInterstitial.setTestDeviceID('EMULATOR');

    this.blnShowAds = true;
    if ((subscription != undefined) && (subscription == '1')) {
      this.blnShowAds = false;
    }

    this.util = new Utils();

    this.cargaAdIntersticial();

    //-----------------------------------------------------------------------

/*    AdMobInterstitial.addEventListener("interstitialDidFailToLoad", () => {
        if (this.blnBloq) {
          //console.log("interstitialDidFailToLoad");
          this.blnBloq = false;
        }
      }
    );

    AdMobInterstitial.addEventListener("interstitialDidLoad", async () => {
        if (this.blnBloq) {
          //console.log("interstitialDidLoad");
          //await AdMobInterstitial.showAdAsync();
        }
      }
    );
*/
    AdMobInterstitial.addEventListener("interstitialDidClose", () => {
        //console.log("interstitialDidClose");
        this.cargaAdIntersticial();
      }
    );
/*
    AdMobInterstitial.addEventListener("interstitialDidOpen", () => {
        //console.log("interstitialDidOpen");
      }
    );

    AdMobInterstitial.addEventListener("interstitialWillLeaveApplication", () => {
        if (this.objThis != undefined) {
        //  this.util.addMinutsSubscription(this.objThis.state.subs_expiresDateSub, 30);
        }
      }

    ); */

  }

  async cargaAdIntersticial() {
    await AdMobInterstitial.requestAdAsync();
  }

  async showIntersticialAd() {
    // Display an interstitial
    if (this.blnShowAds) {
      if (this.countActionsDid >= this.numActionsToShow) {
        //console.log("Imprimiendo ad intersticial: ", this.adIntersticialId)
        this.countActionsDid = 0;
        //await AdMobInterstitial.requestAdAsync();
        await AdMobInterstitial.showAdAsync();
      } else {
        this.countActionsDid = this.countActionsDid + 1;
      }
    }
  }




}
