const GoogleSpreadsheet = require('google-spreadsheet')
const { promisify } = require('util')
var cnpjList = []
const creds = require('./spreadsheet_secret.json');
const spreadsheetCNPJ_secret = `1W_Ov1MvNeR5Qp67fEkqXSpBA6iQNf6RUdz_zK4YB6EY`

async function getCNPJ() {
  cnpjList = []
  console.log("bj")


  const docCNPJ = new GoogleSpreadsheet(spreadsheetCNPJ_secret)
  
  
  console.log("bj")
  await promisify(docCNPJ.useServiceAccountAuth)(creds)
  console.log("bj")
  

    const info = await promisify(docCNPJ.getInfo)()
  
  console.log("aqqqqqqqq")
  const sheet = info.worksheets[0]
  const rows = await promisify(sheet.getRows)({
    offset: 0,
    limit: 9999,
    orderby: 'col2'
  })
  
  rows.forEach(element => {
   
    if(element.cnpj.length>0){
      cnpjList.push(element.cnpj)
    }   
   
  });
  console.log(cnpjList.length)
  return cnpjList
} 


async function getCNPJNaoValidado() {
  cnpjList = []
  console.log("bjnaovalidado")


  const docCNPJ = new GoogleSpreadsheet(spreadsheetCNPJ_secret)
  
  
  console.log("bjnaovalidado")
  await promisify(docCNPJ.useServiceAccountAuth)(creds)
  console.log("bjnaovalidado")
  

    const info = await promisify(docCNPJ.getInfo)()
  
  console.log("aqqqqqqqqnaovalidado")
  const sheet = info.worksheets[0]
  const rows = await promisify(sheet.getRows)({
    offset: 0,
    limit: 9999
  })
  
  try{
    rows.forEach(element => {
       
       if(element.cnpj.length>0 && element.statuscnpj.length==0){
         cnpjList.push(element.cnpj)
       }   
      
     });
  }catch(err){
    console.log("res")
    console.log(err)
    
  }
  
  console.log(cnpjList.length)
  return cnpjList
} 



async function Solicitar(solicitacao,cnpj){
  
  const docCNPJ = new GoogleSpreadsheet(spreadsheetCNPJ_secret)
  await promisify(docCNPJ.useServiceAccountAuth)(creds)
  const info = await promisify(docCNPJ.getInfo)()
  var feita = false
  const sheet = info.worksheets[0]
  const rows = await promisify(sheet.getRows)({
    offset: 0,
    limit: 9999
    //orderby: 'col2'
  })
  console.log("vai começar o for")
  for(var i=0; i<30;i++){
    
    
    
    
    if(rows[i]==undefined){
      console.log("deu undef")
      break;
    }
    rows[i].cnpj = rows[i].cnpj.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '')
    console.log("cnpj "+ rows[i].cnpj)
     if(rows[i] && rows[i].cnpj == cnpj){
      console.log("entrou2: "+ JSON.stringify(solicitacao))
      try{
        if(solicitacao.error==undefined){
          rows[i].statuscnpj="Validado"
        }else{
          rows[i].statuscnpj="Nao encontrado"
        }
      rows[i].nome = solicitacao.name; 
      rows[i].email = solicitacao.email
      rows[i].telefone = solicitacao.phone
      if(solicitacao.address!=undefined){
        rows[i].municipio = solicitacao.address.city
        rows[i].bairro = solicitacao.address.neighborhood
        rows[i].logradouro = solicitacao.address.street
        rows[i].uf = solicitacao.address.state
        rows[i].numero = solicitacao.address.number
        rows[i].cep = solicitacao.address.zip
      }
      if(solicitacao.registration!=undefined){
        rows[i].status = solicitacao.registration.status
        rows[i].ultimaatt = solicitacao.registration.status_date
      }
      if(solicitacao.legal_nature!=undefined){
        rows[i].natureza  = solicitacao.legal_nature.description
      }
      if(solicitacao.primary_activity!=undefined){
        rows[i].atividade = solicitacao.primary_activity.description
      }
      rows[i].abertura = solicitacao.founded
      
      
     
      rows[i].porte = solicitacao.size
      
      }catch(err){
        console.log("err3: "+err)
      }
      try{
        console.log("insert1: "+ rows[i].nome)
        await rows[i].save();
        console.log("insert2: "+ solicitacao.name)
      }catch(err){
        console.log("err insert: "+err)
      }
     
      break;
    }
  }
   // save updates
  return feita

}
module.exports= {
  getCNPJ : getCNPJ,
  Solicitar:Solicitar,
  getCNPJNaoValidado: getCNPJNaoValidado
}