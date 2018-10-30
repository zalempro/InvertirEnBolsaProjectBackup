const urlbase = "https://invertirenbolsa.manuelrispolez.com/";
//const urlbase = "http://testieb.manuelrispolez.com/";

export async function activarNotificaciones(user, pwd, blnActiva, tokenUser, platform) {
  try {
    //let url = urlbase + "apiLoginForo.php";
    let url = urlbase + "controller.php";

    let result = await fetch(url,{method: 'POST',
        headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
             },
        body: JSON.stringify({
               action: "ACTIVAR_NOTIFICACIONES",
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
    console.log("1 - Error retrieving data activarNotificaciones:" + error);
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
