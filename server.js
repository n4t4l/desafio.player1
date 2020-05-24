require('dotenv').config();

//modules
const createError = require('http-errors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const express = require('express');
var jwt = require('jsonwebtoken');

//route linking
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var insertRouter = require('./routes/insert_options');

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : '',
    database : 'player1'
  }
});

//config express
const app = express();
//config express -> parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//config view engine and view folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//config express -> public folder
app.use(express.static(path.join(__dirname, 'public')));

//starting http server with express inside so we can use socket also
var server = require('http').createServer(app);
const io = require('socket.io')(server);
//socket it bro


//ROUTING
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/insert', insertRouter);
app.use('/refresh/',authenticateToken, function(req, res, next) {
	knex('options').then((dados)=>
	  {
      updateOptions(dados);},next);
      res.status(200).send("ok");
});

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

//emit the call to clients to update their front-end with data from database
var updateOptions = function(dados)
{
  io.emit('updateOptions',dados);
}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//SOCKET STUFF
io.on('connection', function(client) {
  console.log('Client connected...');

  client.on('join', function(data) {
      //console.log(data);
  });
  //here we receive a socket.io call from client with an option ID
  client.on('vote', function(data) {
    voteOption(data);
  });

}) 

//add + 1 vote to the given id
var voteOption = function(idv)
{
  
  knex('options').where('id',"=",idv).then((dados)=>
  {
    
    //count the vote :D
    knex('options')
    .where({ id: idv })
    .update({ votes: (dados[0].votes+1) })
    .then(result => 
      {
        knex('options').then((dadosUpdated)=>
        {
          //emit the updated list of votes to all connected users
          io.emit('voteData',dadosUpdated);
          
        });
      });
  });
  
}

server.listen(8080);
