var request = require('request');
const { promisify } = require('util');
const { url } = require('inspector');



async function getInfo(cnpj){
 
    var url = 'https://www.receitaws.com.br/v1/cnpj/'+cnpj
    console.log("url: " + url)
    
    try{
    
      var res =  await promisify(request)(url)
      var body =  JSON.stringify(res.body).replace(/\\/g,'')//remover as barras invertidas
      body = body.substring(1, body.length-1)//remover as aspas no começo e no final
    }catch(err){
        console.log("erro receita api: "+err)
    }
    console.log("retornou receita")
    return JSON.parse(body)
}

module.exports= {
    getInfo: getInfo    
}





