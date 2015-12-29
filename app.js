var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var socketIO = require("socket.io");

var routes = require('./routes/index');
var slides = require('./routes/slides');
var slideshare = require('./routes/slideshare');
var speaker = require('./routes/speaker');
//var passport = require('passport');
var speakerDTO = require('./dto/speakerDTO');
var presentation = require('./routes/presentation');
var PresentationService = require('./service/PresentationService');
var Message = require('./models/Message');
var config = require('./config/config');

//require('./config/passport')(passport);

var app = express();
var io = socketIO();
app.io = io;

var DOMAIN = config.domain;
require('./service/sockets')(io, PresentationService, Message, DOMAIN);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'dfhjdflwkhweihiu231iouhdss'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'presentations')));
app.use(require('node-compass')({mode: 'expanded'}));
//app.use(passport.initialize());
//app.use(passport.session());

app.use('/', routes);
app.use('/slides', slides);

app.use('/slideshare', slideshare);
app.use('/speaker', speaker);
app.use('/presentation', presentation);

app.use('/session', function(req, res) {
    res.json(req.session.speaker);
});

/*require('./routes/oauth/facebook')(app, passport, speakerDTO);
require('./routes/oauth/google')(app, passport, speakerDTO);
require('./routes/oauth/linkedin')(app, passport, speakerDTO);*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;