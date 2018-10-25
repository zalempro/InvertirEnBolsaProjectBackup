const urlbase = "https://invertirenbolsa.manuelrispolez.com/";

export async function getEmpresasGen(indexPais, indexSector) {
  //console.log("Inicio: getEmpresasGen")

  let params = "/historico_dividendos.htm?filter-pais="+indexPais+"&filter-sector="+indexSector;

  let url =  urlbase + "controller.php";
  //console.log(url)
  let result = await fetch(url,{method: 'POST',
      headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
           },
      body: JSON.stringify({
             action: "EMPRESAS_GEN",
             params: encodeURIComponent(params)
           })
  }).then(response => response.json())
  .catch((err) => { console.log(err); });

  //console.log("Fin: getEmpresasGen")
  return result.empresas;
}

/**
* Obtiene el detalle de la empresa, con toda su info histórica
*/
export async function getDetalleEmpresa(urlParam) {
  let url =  urlbase + "controller.php";
  //console.log(url)
  let result = await fetch(url,{method: 'POST',
      headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
           },
      body: JSON.stringify({
             action: "EMPRESAS_DET",
             params: encodeURIComponent(urlParam)
           })
  }).then(response => response.json())
  .catch((err) => { console.log(err); });

  return result.det_empresa;
}
