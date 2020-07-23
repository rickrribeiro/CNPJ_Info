const router = require('express').Router();
const Sheets = require("./spreadsheet")
var receitaAPI= require('./receitaAPI')
// list

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }


router.get('/list', async(req, res) => {
   try{
     console.log("Iniciando")
       var List = await Sheets.getCNPJNaoValidado()
       var i =0;
  
   // console.log("antes de iterar")
    for (var i = 0; i < List.length; i++) {
       // console.log("Lista[i]: "+ List[i])
        var lis = await receitaAPI.getInfo(List[i]);
     //   console.log("iterou"+i)
       // console.log(List[i]+" resultado: "+lis.error)
        await Sheets.Solicitar(lis,List[i])
    }
    
    //95015335d9ad6ee58eb01a5781520ae99270de1ddef83686798956d43bdc2607

    console.log("Finalizado!")
    res.send("Finalizado")
    
  
    //res.send(lis.nome)
  
   }catch(err){
       res.send("err2: "+ err)
   }
});

router.get('/teste', async(req, res) => {
  try{
      console.log("chegou no test")
      var List = await Sheets.getCNPJNaoValidado()
   res.send(List)
 
  }catch(err){
      res.send("err2: "+ err)
  }
});

// fill

module.exports = router;