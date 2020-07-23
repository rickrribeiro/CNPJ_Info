var request = require('request');
const { promisify } = require('util');
const { url } = require('inspector');
const { stringify } = require('querystring');
const secrets = require('./secrets.json')


async function getInfo(cnpj){
 
   // var url = 'https://www.receitaws.com.br/v1/cnpj/'+cnpj
   var url = 'https://api.cnpja.com.br/companies/'+cnpj
   // console.log("url: " + url)
    
    const options = {
        url: url,
        headers: {
            authorization: secrets.authorization
        }
      };
    try{
    
      var res =  await promisify(request)(options)
    //  console.log("ressssssss: "+ JSON.stringify(res))
      var body =  JSON.stringify(res.body).replace(/\\/g,'')//remover as barras invertidas
    //  console.log("bodyyyy:  "+body)
      body = body.substring(1, body.length-1)//remover as aspas no começo e no final
    }catch(err){
        console.log("erro receita api: "+err)
    }
//    console.log("retornou receita")
    return JSON.parse(body)
}

module.exports= {
    getInfo: getInfo    
}





