//import { GridFSBucketReadStream } from '../AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/mongodb';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var import_Data = require('./import_Data.js');
var import_Data_Midnight = require('./import_Data_Midnight.js');

var index = require('./routes/index');
var users = require('./routes/users');
var doc = require('./routes/doc');
var installations = require('./routes/installations');
var bad = require('./routes/bad_Condition');
var bad_Xml = require('./routes/bad_Condition_Xml');
var bad_Csv = require('./routes/bad_Condition_Csv');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/doc', doc);
app.use('/installations', installations);
app.use('/mauvaise_Condition', bad);
app.use('/mauvaise_Condition_Xml', bad_Xml);
app.use('/mauvaise_Condition_Csv', bad_Csv);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

//At npm start the collection installation_Data is drop and the installations data are import again
/*import_Data.drop_Db_Import_Data(function(err, res){
  if(err){
    console.log("error");
    return err;
  }else{
    console.log("Drop and import data complete!");
    return res;
  }
});*/

//Collection drop and import data at every midnight
/*import_Data_Midnight.import_Data_Midnight(function(err, res){
  if(err){
    return err;
  }else{
    console.log("Data updated!");
    return res;
  }
});*/

module.exports = app;
