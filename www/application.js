/// <reference path="../typings/node/node.d.ts"/>
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var application = express();

// view engine setup
application.set('views', path.join(__dirname, 'views'));
application.set('view engine', 'jade');

// uncomment after placing your favicon in /public
application.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
application.use(logger('dev'));
application.use(bodyParser.json());
application.use(bodyParser.urlencoded({ extended: false }));
application.use(cookieParser());
application.use(express.static(path.join(__dirname, 'public')));

application.use('/', routes);
application.use('/users', users);

// catch 404 and forward to error handler
application.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (application.get('env') === 'development') {
  application.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
application.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = application;
