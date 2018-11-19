const urlbase = "https://invertirenbolsa.manuelrispolez.com/";
//const urlbase = "http://testieb.manuelrispolez.com/";

export async function getSuscripcionListUser(user, pwd) {
  //console.log("dentro getSuscripcionListUser: ")

  try {
    //let url = urlbase + "apiLoginForo.php";
    let url = urlbase + "controller.php";

    let result = await fetch(url,{method: 'POST',
        headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
             },
        body: JSON.stringify({
               action: "GET_SUBS_LIST",
               user: user,
               pwd: pwd
             })
    }).then(response => response.json())
    .catch((err) => { console.log(err); });

    //console.log(result);
    return result;

  } catch (error) {
    console.log("1 - Error retrieving data getSuscripcionListUser:" + error);
  }
}

export async function getSuscripcionListUserPost(strUsuario, strPassword, pageUrl, temasForo ) {

  try {
    let url =  urlbase + "controller.php";
    let urlTema = encodeURIComponent(pageUrl);

    let result = await fetch(url,{method: 'POST',
        headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
             },
        body: JSON.stringify({
               action: "GET_SUBS_LIST_POSTS",
               url: urlTema,
               user: strUsuario,
               pwd: strPassword
             })
    }).then(response => response.json())
    .catch((err) => { console.log(err); });

    //console.log(result)

    temasForo = null;
    return result.temas;
  } catch (error) {
    console.log("1 - Error retrieving data getSuscripcionListUserPost:" + error);
    return null;
  }

}




export async function activarNotificacionesMisPosts(user, pwd, blnActiva, tokenUser, platform) {
  try {
    //let url = urlbase + "apiLoginForo.php";
    let url = urlbase + "controller.php";

    let result = await fetch(url,{method: 'POST',
        headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
             },
        body: JSON.stringify({
               action: "ACTIVAR_NOTIFICACIONES_MIS_POSTS",
               user: user,
               pwd: pwd,
               tokenUser: tokenUser,
               platform: platform,
               estado: blnActiva
             })
    }).then(response => response.json())
    .catch((err) => { console.log(err); });

    return result.config;

  } catch (error) {
    console.log("1 - Error retrieving data activarNotificacionesMisPosts:" + error);
  }
}

export async function inicializaNotificaciones(user, pwd, tokenUser, platform) {
  try {
    //let url = urlbase + "apiLoginForo.php";
    let url = urlbase + "controller.php";

    let result = await fetch(url,{method: 'POST',
        headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
             },
        body: JSON.stringify({
               action: "INIT_NOTIFICACIONES",
               user: user,
               pwd: pwd,
               tokenUser: tokenUser,
               platform: platform
             })
    }).then(response => response.json())
    .catch((err) => { console.log(err); });

    return result.notificaciones;

  } catch (error) {
    console.log("1 - Error retrieving data activarNotificaciones:" + error);
  }
}
