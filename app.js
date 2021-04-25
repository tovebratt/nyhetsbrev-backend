var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
const { MongoClient } = require('mongodb');

var app = express();


MongoClient.connect("mongodb+srv://tove:trav@cluster0.3qj65.mongodb.net/nyhetsbrev.prenumeranter?retryWrites=true&w=majority", {
  useUnifiedTopology: true
})
.then(client => {
  console.log("Vi är uppkopplade mot databasen");

  const db = client.db("nyhetsbrev");
  app.locals.db = db;
})


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

module.exports = app;
