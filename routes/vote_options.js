var express = require('express');
var router = express.Router();

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : '',
    database : 'player1'
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  knex('admins').then((dados)=>{res.send(dados);},next)
});

module.exports = router;
