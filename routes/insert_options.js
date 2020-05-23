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
	//console.log(req);
	const token = req.cookies["player1_cookie"];
	if(token == null || token == "player1_cookie"){return res.sendStatus(401);}
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

router.get('/edit',authenticateToken, function(req, res, next){

		console.log("req id "+req.query.id);
		knex('options')
		.where('id',req.query.id)
		.then((dados)=>
	{
		console.log("user dados.img"+dados[0].img);
	  console.log(req.query);
	  res.render('edit_options',{title: 'Edite a opção '+dados[0].name,users:dados,id:req.query.id});
	  },next)


})


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
