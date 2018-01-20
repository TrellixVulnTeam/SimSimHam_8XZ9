var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var request = require('request');
var multer = require('multer');
var gm = require('gm');
var randomstring = require('randomstring');
const vision = require('@google-cloud/vision');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        var date = new Date();
        var month = date.getMonth();
        var dt = date.getDate();
        var min = date.getMinutes();
        var year = date.getFullYear();
        var hour = date.getHours();
        var sec = date.getSeconds();

        console.log(" Year : "+year);
        console.log(" Month : "+sec)
        cb(null,year+"."+month+"."+dt+"."+hour+"."+min+"."+sec+"."+file.originalname)
    }
})
const translate = require('google-translate-api');

var upload = multer({ 'storage': storage})

var app = express();

const Storage = require('@google-cloud/storage');

const storge = Storage({
    keyFilename: 'all-blue-375cb13ad77d.json'
});

// Makes an authenticated API request.
storge.getBuckets().then((results) => {
    const buckets = results[0];
    console.log('Buckets:');
    buckets.forEach((bucket) => {
        console.log(bucket.name);
    });
})
.catch((err) => {
    console.error('ERROR:', err);
});

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html')
app.set('views', 'views')
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

require('./routes/upload')(app , upload , request , vision , translate , gm , randomstring);
require('./routes/map')(app , request);
require('./routes/search')(app , request);

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

  // render the error page;
  res.status(err.status || 500)
});

module.exports = app;
