var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()); router.use(bodyParser.urlencoded({ extended: true }));
const knex = require('knex')({
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
  knex('options').then((dados)=>
  {
	  console.log(req.query);
	  res.render('edit_options',{title: 'Insira sua opção',users:dados,dir:__dirname});
	  },next)
		
});

router.post('/', function(req, res, next){
  var formidable = require('formidable');
  var fs = require('fs');

  var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = 'images/' + files.filetoupload.name;

      fs.rename(oldpath, 'public/'+newpath, function (err) {
        if (err) throw err;
			knex('options').insert({name:fields.name_of_place,img:newpath,votes:0})
			.then( function (result) {
			  res.redirect('/insert');     // respond back to request
		   });
        
      });
    });
	
	
	   
	
});

module.exports = router;
