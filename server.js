require('dotenv').config();

//modules
const createError = require('http-errors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const errs = require('restify-errors');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
      console.log(data);
  });

  client.on('vote', function(data) {
    voteOption(data);
    
    
  });
}) 
//KNEX CONNECTION AND METHODS



var voteOption = function(idv)
{
  //get the number of votes on the server
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
