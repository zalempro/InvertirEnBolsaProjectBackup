import { AsyncStorage } from "react-native";


export default class Utils {
  constructor() {
    //Variables para decodeData
    this.decode = require('decode-html');
    this.wtf8 = require('wtf-8');
    Entities = require('html-entities').AllHtmlEntities;
    this.entities = new Entities();

    //this.uuidv4 = require('uuid/v4');
  }

  decodeData(strData) {
    return this.decode(this.entities.decode(this.wtf8.decode(strData)));
  }

  uuidv4() {
    const uuidv4 = require('uuid/v4')

    // Incantations
    //console.log("a",uuidv4());
    return uuidv4();


  /*  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });*/
  }

  //Functions for Persist DATA
  async getKey(strStore,strKey, objThis) {
    try {
      const value = await AsyncStorage.getItem('@'+strStore+':'+strKey);
      objThis.setState({[strKey]: value});
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }

  async saveKey(strStore,strKey,value) {
    try {
      await AsyncStorage.setItem('@'+strStore+':'+strKey, value);
    } catch (error) {
      console.log("Error saving data" + error);
    }
  }

  //Functions for Persist DATA
  async getKeyAndGetAuthChatkit(strStore,strKey, objThis) {
    try {
      const value = await AsyncStorage.getItem('@'+strStore+':'+strKey);
      objThis.setState({[strKey]: value});

      let urlbase = urlbase = "http://invertirenbolsa.manuelrispolez.com/";
      let url = urlbase + "authUserChatkit.php?user="+objThis.state[strKey];

      let value2 = await fetch(url,{method: 'GET'}).then(response => response.json());
      objThis.setState({"authUser": value2});

    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }

  async getAuthInfo(objThis) {
    try {
      const getKeyA1 = this.getKey("AuthIEB","usuario", objThis)
      const val1 = await getKeyA1;

      const getKeyA3 = this.getKey("AuthIEB","password", objThis)
      const val3 = await getKeyA3;

      const getKeyA4 = this.getKey("AuthIEB","userIdToken", objThis)
      const val4 = await getKeyA4;

      console.log("getAuthInfo: ",objThis.state.usuario);
      console.log("userIdToken: ",objThis.state.userIdToken);
      //console.log(objThis.state.password);
    } catch (error) {
      console.err("Error in getAuthInfo " + error);
    }
  }


  async getSubscriptionInfo(objThis) {
    try {
      const getKey1 = this.getKey("SubscriptionIEB","subs_expiresDateSub", objThis)
      const val1 = await getKey1;

      const getKey3 = this.getKey("SubscriptionIEB","subs_productId", objThis)
      const val3 = await getKey3;

      // PARA PRUEBAS - SIEMPRE ACTIVO
//      const saveKey = this.saveKey("SubscriptionIEB", "subs_active","1");
//      const val4 = await saveKey;
      blnTest = false;
      // FIN PARA PRUEBAS - SIEMPRE ACTIVO

      let dateNow = Date.now();
      console.log("Control:",objThis.state.subs_expiresDateSub)
      console.log("Control2:",dateNow)
      if ((objThis.state.subs_expiresDateSub > dateNow) || (blnTest)) {
        //Activa - con suscripción
        const getKey2 = this.getKey("SubscriptionIEB","subs_active", objThis);
        const val2 = await getKey2;

        const saveKey = this.saveKey("SubscriptionIEB", "subs_active","1");
        const val4 = await saveKey;

        const getKey3 = this.getKey("SubscriptionIEB","subs_active", objThis);
        const val5 = await getKey3;

        console.log("getSubscriptionInfo: Suscripción Activa");
      } else {
        //No activa - sin suscripción
        //Asseguramos que esté marcado como NO activa ( 0 )
        const saveKey = this.saveKey("SubscriptionIEB", "subs_active","0");
        const val4 = await saveKey;

        const getKey2 = this.getKey("SubscriptionIEB","subs_active", objThis);
        const val2 = await getKey2;

        console.log("getSubscriptionInfo: Sin Suscripción ")
      }

      //console.log(objThis.state.subs_expiresDateSub);
      //console.log(objThis.state.subs_productId);
    } catch (error) {
      console.log("Error in getSubscriptionInfo " + error);
    }
  }


  async addMinutsSubscription(subs_expiresDateSub, intMinutos) {

    try {
      //console.log(intMinutos)
      //console.log("addMinuts subs_expiresDateSub 1: ", parseInt(subs_expiresDateSub));
      let dateNow = Date.now();
      if (parseInt(subs_expiresDateSub) > dateNow) {
         //Si ya tiene suscripción, se le añade tiempo final
         newDateExpires = new Date(parseInt(subs_expiresDateSub) + parseInt(intMinutos)*60001).getTime();
      } else {
        //Si no ya tiene suscripción, se le añade tiempo desde AHORA
        newDateExpires = new Date(dateNow + intMinutos*60000).getTime();
      }
      //Guardamos el nuevo valor
      const getKey2 = this.saveKey("SubscriptionIEB", "subs_expiresDateSub",newDateExpires.toString());
      const val2 = await getKey2;

      const getKey3 = this.saveKey("SubscriptionIEB", "subs_active","1");
      const val3 = await getKey3;
      //console.log("addMinuts newDateExpires: ", newDateExpires.toString());
    } catch (error) {
      console.log("Error in addMinutsSubscription " + error);
    }

  }

}
