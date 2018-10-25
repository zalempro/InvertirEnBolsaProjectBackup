const urlbase = "https://invertirenbolsa.manuelrispolez.com/";
//const urlbase = "http://testieb.manuelrispolez.com/";

export async function getNews(indexPais, indexEmpresa, limitStart, noticias, blnLoadMore) {
  console.log("getNews In")

  let params = "component/com_noticiasempresas/Itemid,450/filter-feed,"+indexEmpresa+"/filter-pais,"+indexPais+"/lang,es/limit,40/limitstart,"+limitStart+"/view,feeds/";

  let url =  urlbase + "controller.php";
  //console.log(url)
  let result = await fetch(url,{method: 'POST',
      headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
           },
      body: JSON.stringify({
             action: "NEWS",
             params: encodeURIComponent(params)
           })
  }).then(response => response.json())
  .catch((err) => { console.log(err); });

  if ((noticias != "") && (blnLoadMore)) {
    result.noticias.lista_noticias.forEach(newItem => noticias.lista_noticias.push(newItem));
    //temasForo.paginasTot   = result.temas.paginasTot;
    //temasForo.paginaActual = result.temas.paginaActual;
    return noticias;
  } else {
    return result.noticias;
  }
}
