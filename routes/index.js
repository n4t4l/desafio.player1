var express = require('express');
var router = express.Router();

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : '',
    database : 'player1'
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  
    
    knex('options').then((dados)=>
  {
    console.log(dados[0].name);
	  //res.send(dados);
    res.render('index',{title: 'Aplicação de votos Alex Natalino',users:dados,
    users2:JSON.stringify(dados)});
	  },next)
	  
  
  
});

module.exports = router;
