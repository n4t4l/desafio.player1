var express = require('express');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var router = express.Router();
var jwt = require('jsonwebtoken');

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : '',
    database : 'player1'
  }
});
//LOGIN ROUTE


router.post('/', async (req, res) => {
  
  //console.log(req.body);
  try
  {
    //check if user exists in the database
    knex('admins').where("login","=",req.body.name).then( async (dados)=>
    {
      //console.log(dados[0])
      //check if password matches
      if(await bcrypt.compare(req.body.password,dados[0].pw))
      {
        console.log("acess granted");
        //send acess token
        const acessToken = jwt.sign(dados[0].toString(),process.env.ACESS_TOKEN_SECRET);
        res.status(200).json({acessToken:acessToken});
      }
     
      });

    
    
  }
  catch (e) {
    console.log("Error", e.stack);
    console.log("Error", e.name);
    console.log("Error", e.message);
  }

  
 });

 //REGISTER ROUTE
 //TO-DO: check if username is avaliable
 router.post('/register/', async (req, res) => {
  var user = {}
  try
  {
    console.log("req body: "+req.toString());
    //encrypting password
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    //creating data struct to send to database
    user = {name: req.body.name,password: hashedPassword};
    //console.log("User: "+user.toString());
    //put the login and hashed pw in the database
    knex('admins').insert({login:user.name,pw:user.password,can_edit:1})
    .then( function (result) {
      res.status(201).send("user inserted");     // respond back to request
    });
    
  }
  catch (e) {
    console.log("Error", e.stack);
    console.log("Error", e.name);
    console.log("Error", e.message);
    res.status(500).send("server error");
}

  
 });

 //if we get the authtoken auto redirect to the admin page
 function authenticateToken_autologin(req,res,next)
 {
   console.log(req);
   const token = req.cookies["Player1"];
   
   if(token == null || token == ""){return res.render('login');}
   jwt.verify(token,process.env.ACESS_TOKEN_SECRET, (err) =>
   {
      if(err){return res.render('login');}
      res.redirect('/insert/');
   })
   next;
 
 }


router.get('/',authenticateToken_autologin,function(req, res, next) {
  
  res.render('login');
});

module.exports = router;
