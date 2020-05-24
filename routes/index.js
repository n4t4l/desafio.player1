require('dotenv').config();
//modules
var express = require('express');
var router = express.Router();
const io = require('socket.io');
//knex config
const knex = require('knex')({
  client: process.env.DB_CLIENT,
  connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  
    
    knex('options').then((dados)=>
   {
   
    res.render('index',{title: 'Aplicação de votos Alex Natalino',users:dados,
    users2:JSON.stringify(dados)});
	  },next)
	  
  
  
});



module.exports = router;
