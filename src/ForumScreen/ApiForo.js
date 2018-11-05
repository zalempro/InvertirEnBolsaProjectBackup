const urlbase = "https://invertirenbolsa.manuelrispolez.com/";
//const urlbase = "http://testieb.manuelrispolez.com/";


export async function getHilosPrincipales(strUsuario, strPassword) {
  //let url =  urlbase + "index_foro.php";
  let url =  urlbase + "controller.php";
  //console.log(url)
  let result = await fetch(url,{method: 'POST',
      headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
           },
      body: JSON.stringify({
             action: "INDEX_FORUM",
             user: strUsuario,
             pwd: strPassword
           })
  }).then(response => response.json())
  .catch((err) => { console.log(err); });

  //console.log(result)
  //let result = await fetch(url).then(response => response.json());
  return result.hilos;
}




export async function getTemasForo(
  pageUrl, paginasTot, paginaActual, temasForo, strUsuario, strPassword) {

  //console.log("getTemasForo")

  if (typeof paginaActual != "undefined") {
    strPage = "/page"+paginaActual;
  } else {
    strPage = "";
  }

  //let url =  urlbase + "temas_foro.php?url=" + encodeURIComponent(pageUrl) + strPage;
  let url =  urlbase + "controller.php";
  let urlTema = encodeURIComponent(pageUrl) + strPage;

  let result = await fetch(url,{method: 'POST',
      headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
           },
      body: JSON.stringify({
             action: "TEMAS_FORUM",
             url: urlTema,
             user: strUsuario,
             pwd: strPassword
           })
  }).then(response => response.json())
  .catch((err) => { console.log(err); });

  if (temasForo != "") {
    result.temas.post.forEach(newItem => temasForo.post.push(newItem))
    temasForo.paginasTot   = result.temas.paginasTot;
    temasForo.paginaActual = result.temas.paginaActual;
    return temasForo;
  } else {
    return result.temas;
  }
}

export async function getUltPostsForo(
   pageUrl, paginasTot, paginaActual, temasForo, strUsuario, strPassword, blnReset) {

  //console.log("getUltPostsForo")

  if ((typeof paginaActual != "undefined") && (pageUrl != '')) {
    strPage = "&page="+paginaActual;
  } else {
    strPage = "";
  }

  let url =  urlbase + "controller.php";
  let urlTema = encodeURIComponent(pageUrl + strPage);

  if (blnReset) {
    urlTema = '';
  }

  let result = await fetch(url,{method: 'POST',
      headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
           },
      body: JSON.stringify({
             action: "ULT_POSTS_FORUM",
             url: urlTema,
             user: strUsuario,
             pwd: strPassword
           })
  }).then(response => response.json())
  .catch((err) => { console.log(err); });


  if ((temasForo != "") && (blnReset == false)) {
    result.temas.post.forEach(newItem => temasForo.post.push(newItem))
    temasForo.paginasTot   = result.temas.paginasTot;
    temasForo.paginaActual = result.temas.paginaActual;

    return temasForo;
  } else {

    temasForo = null;
    return result.temas;
  }
}

export async function getEntradasForo(
  pageUrl, paginasTot, paginaActual, paginaLess, entradasForo, strUsuario, strPassword, strTypeLoad) {
  if (typeof paginaActual != "undefined") {
    if (strTypeLoad == "less") {
      strPage = "/page"+paginaLess;
    } else if (strTypeLoad == "more") {
      strPage = "/page"+paginaActual;
    } else {
      strPage = "&goto=newpost";
    }
  } else {
    strPage = "&goto=newpost";
  }

  let url =  urlbase + "controller.php";
  let urlTema = encodeURIComponent(pageUrl + strPage);

  let result = await fetch(url,{method: 'POST',
      headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
           },
      body: JSON.stringify({
             action: "ENTRADAS_FORUM",
             url: urlTema,
             user: strUsuario,
             pwd: strPassword
           })
  }).then(response => response.json())
  .catch((err) => { console.log(err); });

  //let result = await fetch(url).then(response => response.json());
  //console.log("salida:", result)

  if (entradasForo != "") {
    if (strTypeLoad == "less") {
      result.entradas.post.reverse().forEach(newItem => entradasForo.post.unshift(newItem))
    } else if (strTypeLoad == "more") {
      result.entradas.post.forEach(newItem => entradasForo.post.push(newItem))
    } else {
      return result.entradas;
    }
    //entradasForo.paginasTot = result.entradas.paginasTot;
    //entradasForo.paginaActual = result.entradas.paginaActual;
    return entradasForo;
  } else {
    //console.log(result.entradas)
    return result.entradas;
  }
}


export async function enviarReport(strUsuario, strPassword, report, posttitle, strMessage) {
   blnError = false;

   //console.log("report:", report)
   //console.log("posttitle:", posttitle)
   //console.log("strMessage:", strMessage)


   if ((report != null) &&
       (posttitle != null) && (strUsuario != null) && (strPassword != null) && (strMessage != null)) {

         let url = urlbase + "controller.php";

         let result = await fetch(url,{method: 'POST',
             headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                  },
             body: JSON.stringify({
                    action: "REPORT_FORUM",
                    report: encodeURIComponent(report),
                    posttitle: posttitle,
                    message: strMessage,
                    user: strUsuario,
                    pwd: strPassword
                  })
         }).then(response => response.json())
         .catch((err) => { console.log(err); });
         return result.newReply

   } else {
     blnError = true;
     return null;
   }

}

export async function enviarContacto(strMessage) {
   blnError = false;

   //console.log("report:", report)
   //console.log("posttitle:", posttitle)
   //console.log("strMessage:", strMessage)


   if (strMessage != null) {

         let url = urlbase + "controller.php";

         let result = await fetch(url,{method: 'POST',
             headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                  },
             body: JSON.stringify({
                    action: "ENVIAR_CONTACTO",
                    message: strMessage
                  })
         }).then(response => response.json())
         .catch((err) => { console.log(err); });
         return result.newReply

   } else {
     blnError = true;
     return null;
   }
}

export async function enviarNewReply(strUsuario, strPassword, strUrl, strMessage, strTitulo) {
    blnError = false;

    if ((strUrl != null) &&
        (strMessage != null) && (strUsuario != null) && (strPassword != null)) {

          let url = urlbase + "controller.php";

          let result = await fetch(url,{method: 'POST',
              headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
                   },
              body: JSON.stringify({
                     action: "NEW_REPLY_FORUM",
                     url: encodeURIComponent(strUrl),
                     titulo: strTitulo,
                     message: strMessage,
                     user: strUsuario,
                     pwd: strPassword
                   })
          }).then(response => response.json())
          .catch((err) => { console.log(err); });
          return result.newReply

    } else {
      blnError = true;
      return null;
    }

}


export async function enviarNewTema(strUsuario, strPassword, strUrl, strTitulo, strMessage) {
    blnError = false;

    if ((strUrl != null) && (strTitulo != null) &&
        (strMessage != null) && (strUsuario != null) && (strPassword != null)) {

          let url = urlbase + "controller.php";

          let result = await fetch(url,{method: 'POST',
              headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
                   },
              body: JSON.stringify({
                     action: "NEW_TEMA_FORUM",
                     url: encodeURIComponent(strUrl),
                     titulo: strTitulo,
                     message: strMessage,
                     user: strUsuario,
                     pwd: strPassword
                   })
          }).then(response => response.json())
          .catch((err) => { console.log(err); });

          //console.log(result.newTema)
          return result.newTema

    } else {
      blnError = true;
      return null;
    }

}


export async function updateNoficationList(strUsuario, strPassword, strToken, strPlatform) {

    if ((strToken != null) && (strUsuario != null) && (strPassword != null)) {

          let url = urlbase + "controller.php";

          let result = await fetch(url,{method: 'POST',
              headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
                   },
              body: JSON.stringify({
                     action: "UPDATE_NOFIFICACION_LIST",
                     token: strToken,
                     user: strUsuario,
                     pwd: strPassword,
                     platform: strPlatform
                   })
          }).then(response => response.json())
          .catch((err) => { console.log(err); });

          return null;
    } else {
      return null;
    }

}


export async function actualizarNotificacionHilo(strURL, strUsuario, blnChecked) {

    if ((strURL != null) && (strUsuario != null) ) {

          let url = urlbase + "controller.php";

          let result = await fetch(url,{method: 'POST',
              headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
                   },
              body: JSON.stringify({
                     action: "UPDATE_NOFIFICACION_HILO",
                     urlHilo: strURL,
                     user: strUsuario,
                     blnChecked: blnChecked
                   })
          }).then(response => response.json())
          .catch((err) => { console.log(err); });

          return result['result'];
    } else {
      return null;
    }

}
