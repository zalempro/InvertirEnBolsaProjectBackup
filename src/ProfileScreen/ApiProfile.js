const urlbase = "https://invertirenbolsa.manuelrispolez.com/";
//const urlbase = "http://testieb.manuelrispolez.com/";

export async function loginForum(user, pwd) {
  try {
    //let url = urlbase + "apiLoginForo.php";
    let url = urlbase + "controller.php";

    let result = await fetch(url,{method: 'POST',
        headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
             },
        body: JSON.stringify({
               action: "LOGIN_PATRIMONIO",
               user: user,
               pwd: pwd
             })
    }).then(response => response.json())
    .catch((err) => { console.log(err); });
    //console.log(result)
    return result.loginForo;

  } catch (error) {
    console.log("1 - Error retrieving data loginForum:" + error);
  }
}

export async function createUserChatkit(user) {
  let url = urlbase + "createUserChatkit.php?user="+user;
  //let url    =  urlbase + "empresas_gen.php?params=" + encodeURIComponent(params);
  let result = await fetch(url,{method: 'GET'}).then(
    response => response.json()
  ).catch((error)=>{
    console.log("0 - Error retrieving data createUserChatkit:" + error);
  });
  return result.createdUserChatkit;
}

export async function authUserChatkit(user) {
  let url = urlbase + "authUserChatkit.php?user="+user;
  console.log(url)
  let result = await fetch(url,{method: 'GET'}).then(
    response => response.json()
  ).catch((error)=>{
    console.log("0 - Error retrieving data authUserChatkit:" + error);
  });

  return result.auth;
}
