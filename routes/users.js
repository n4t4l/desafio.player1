var express = require('express');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var router = express.Router();
var jwt = require('jsonwebtoken');

var knex = require('knex')({
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
  
  console.log(req.body);
  try
  {
    knex('admins').where("login","=",req.body.name).then( async (dados)=>
    {
      console.log(dados[0])
      
      if(await bcrypt.compare(req.body.password,dados[0].pw))
      {

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
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    user = {name: req.body.name,password: hashedPassword};
    console.log("User: "+user.toString());
    //put the login and hashed pw in the database
    knex('admins').insert({login:user.name,pw:user.password,can_edit:0})
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
 function authenticateToken(req,res,next)
 {
   console.log(req);
   const token = req.cookies["player1_cookie"];
   if(token == null || token == "player1_cookie"){return res.sendStatus(401);}
   jwt.verify(token,process.env.ACESS_TOKEN_SECRET, (err,user) =>
   {
     if(err){return res.sendStatus(401);}
     res.redirect('/insert/');
   })
 
 }


router.get('/', authenticateToken,function(req, res, next) {
  
  res.render('users');
});

module.exports = router;
