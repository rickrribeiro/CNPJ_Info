const GoogleSpreadsheet = require('google-spreadsheet')
const { promisify } = require('util')
var cnpjList = []
const creds = require('./spreadsheet_secret.json');
const spreadsheetCNPJ_secret = `1W_Ov1MvNeR5Qp67fEkqXSpBA6iQNf6RUdz_zK4YB6EY`

async function getCNPJ() {
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
    limit: 25,
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

async function Solicitar(solicitacao,cnpj){
  const docCNPJ = new GoogleSpreadsheet(spreadsheetCNPJ_secret)
  await promisify(docCNPJ.useServiceAccountAuth)(creds)
  const info = await promisify(docCNPJ.getInfo)()
  var feita = false
  const sheet = info.worksheets[0]
  const rows = await promisify(sheet.getRows)({
    offset: 0,
    limit: 35
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
      console.log("entrou2: "+cnpj)
      try{
      rows[i].nome = solicitacao.nome; 
      rows[i].email = solicitacao.email
      rows[i].uf = solicitacao.uf
      rows[i].fantasia = solicitacao.fantasia
      rows[i].situacao = solicitacao.situacao
      rows[i].telefone = solicitacao.telefone
      }catch(err){
        console.log("err3: "+err)
      }
      try{
        await rows[i].save();
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
  Solicitar:Solicitar
}