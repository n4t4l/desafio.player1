require('dotenv').config();
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
var fs = require('fs');
var formidable = require('formidable');
router.use(bodyParser.urlencoded({ extended: true }));router.use(cookieParser());

const knex = require('knex')({
	client: process.env.DB_CLIENT,
	connection: {
	  host : process.env.DB_HOST,
	  user : process.env.DB_USER,
	  password : process.env.DB_PASSWORD,
	  database : process.env.DB_DATABASE
	}
  });
//AUTH COOKIE 

function authenticateToken(req,res,next)
{
	const token = req.cookies["Player1"];
	if(token == null || token == ""){return res.render('login');}
	jwt.verify(token,process.env.ACESS_TOKEN_SECRET, (err,user) =>
	{
		if(err){console.log("travei no insert2");return res.render('login');}
		next();
	})
	
}
/* GET options listing. */
router.get('/',authenticateToken, function(req, res, next) {
  knex('options').then((dados)=>
  {
	  //console.log("req query get "+req.query);
	  //res.send(dados);
	  res.render('insert_options',{title: 'Insira sua opção',users:dados,dir:__dirname});
	  },next)

});



//route to edit page
router.get('/edit',authenticateToken, function(req, res, next){

	console.log("req id "+req.query.id);
	knex('options')
	.where('id',req.query.id)
	.then((dados)=>
{
	console.log("user dados.img"+dados[0].img);
  //console.log(req.query);
  res.render('edit_options',{title: 'Edite a opção '+dados[0].name,users:dados,users2:JSON.stringify(dados[0]),id:req.query.id});
  },next)


})

//PUT FOR EDITING OPTIONS
router.put('/',authenticateToken, function(req, res, next)
{



	var form = new formidable.IncomingForm();
	//parsing the form for all that juice data (and file)
    form.parse(req, function (err, fields, files) {
	  //if there is no image, update the text fields	
      if(files.filetoupload.size == 0)
      {
        knex('options').update({name:fields.name_of_place,img:fields.img,votes:fields.votes}).where("id",fields.id)
        .then( function (result) {res.send('/insert');});// respond back to request
      }
      else
      {
		//get the tempfile path and create a new one in permanent storage
		var oldpath = files.filetoupload.path;
		var newpath = 'images/' + files.filetoupload.name;
        fs.rename(oldpath, 'public/'+newpath, function (err) 
        {
		  if (err) throw err;
		  //update the database
          knex('options').update({name:fields.name_of_place,img:newpath,votes:fields.votes}).where("id",fields.id)
          .then( function (result) {res.send('/insert');});// respond back to request
        });
      }

    });
	
	
	   
	
});


//POST FOR INSERTING NEW OPTION
router.post('/',authenticateToken, function(req, res, next){

	var form = new formidable.IncomingForm();
	//parsing the form for all that juice data (and file)
	form.parse(req, function (err, fields, files) 
	{
	  //get the tempfile path and create a new one in permanent storage
      var oldpath = files.filetoupload.path;
      var newpath = 'images/' + files.filetoupload.name;

	  fs.rename(oldpath, 'public/'+newpath, function (err) 
	  {
      		if (err) throw err;
			//update the database
			knex('options').insert({name:fields.name_of_place,img:newpath,votes:0})
			.then( function (result) 
			{
			  console.log(result);
			  res.sendStatus(201).send("ok");     // respond back to request
		   });

      });
    });




});



//DELETE for deleting options
router.delete('/',authenticateToken, function(req, res, next){
 
	knex('options')
	.where('id',"=",req.query.id)
	.del().then( function (result) {
		res.sendStatus(200).send("deleted by koringaum");
	   });

})



module.exports = router;
