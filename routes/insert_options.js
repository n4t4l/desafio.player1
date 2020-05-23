var express = require('express');
var axios = require('axios');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
router.use(cookieParser());

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

//AUTH COOKIE 

function authenticateToken(req,res,next)
{
	const token = req.cookies["Player1"];
	if(token == null || token == ""){return res.sendStatus(401);}
	jwt.verify(token,process.env.ACESS_TOKEN_SECRET, (err,user) =>
	{
		if(err){return res.sendStatus(401);}
		next();
	})

}
/* GET options listing. */
router.get('/',authenticateToken, function(req, res, next) {
  knex('options').then((dados)=>
  {
	  console.log("req query get "+req.query);
	  //res.send(dados);
	  res.render('insert_options',{title: 'Insira sua opção',users:dados,dir:__dirname});
	  },next)

});

router.delete('/',authenticateToken, function(req, res, next){
 
		knex('options')
		.where('id',"=",req.query.id)
		.del().then( function (result) {
			  //res.redirect('/insert');
        res.send("deleted by koringaum");
		   });

})

//route to edit page
router.get('/edit',authenticateToken, function(req, res, next){

		console.log("req id "+req.query.id);
		knex('options')
		.where('id',req.query.id)
		.then((dados)=>
	{
		console.log("user dados.img"+dados[0].img);
	  console.log(req.query);
	  res.render('edit_options',{title: 'Edite a opção '+dados[0].name,users:dados,users2:JSON.stringify(dados[0]),id:req.query.id});
	  },next)


})

//POST FOR EDITING
router.post('/edit',authenticateToken, function(req, res, next)
{
 	var formidable = require('formidable');
  	var fs = require('fs');

	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      console.log(files.filetoupload);
      if(files.filetoupload.size == 0)
      {
        knex('options').where("id","=",fields.id).update({name:fields.name_of_place,img:fields.img2,votes:fields.votes})
        .then( function (result) {res.send('/insert');});// respond back to request
      }
      else
      {
		var oldpath = files.filetoupload.path;
		var newpath = 'images/' + files.filetoupload.name;
        fs.rename(oldpath, 'public/'+newpath, function (err) 
        {
          if (err) throw err;
          knex('options').insert({name:fields.name_of_place,img:newpath,votes:fields.votes})
          .then( function (result) {res.send('/insert');});// respond back to request
        });
      }

    });
	
	
	   
	
});


//POST FOR INSERTING NEW OPTION
router.post('/',authenticateToken, function(req, res, next){
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
