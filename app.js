/**
 * Module dependencies
 */
var mongoose = require('mongoose'); 				// mongoose for mongodb
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');						// log requests to the console (express4)
var cookieParser = require('cookie-parser');
var compression = require('compression');
var bodyParser = require('body-parser');			// pull information from HTML POST (express4)

var routes = require('./routes');
var api = require('./routes/api');
  
var app = module.exports = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// eventually this mime type configuration will need to change
// https://github.com/visionmedia/send/commit/d2cb54658ce65948b0ed6e5fb5de69d022bef941
var mime = express.static.mime;
mime.define({
	'application/json' : ['czml', 'json', 'geojson', 'topojson', 'gltf'],
	'text/plain' : ['glsl']
});
	
app.use(favicon());
// log every request to the console
app.use(logger('dev'));
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(compression());
// set the static files location /public/img will be /img for users
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Error handlers
 */

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

/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API for routes
app.get('/api/routes', api.getRoutes);
app.get('/api/routes/:id', api.getRoute);
app.post('/api/routes', api.createRoute);
app.put('/api/routes/:id', api.updateRoute);
app.delete('/api/routes/:id', api.deleteRoute);
// JSON API for users
app.get('/api/users', api.getUsers);
app.get('/api/users/:id', api.getUser);
app.post('/api/users', api.createUser);
app.put('/api/users/:id', api.updateUser);
app.delete('/api/users/:id', api.deleteUser);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

mongoose.connect('mongodb://web3D:web3D@localhost/web3D');
