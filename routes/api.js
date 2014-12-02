/*
 * Serve JSON to our AngularJS client
 */
var mongoose = require('mongoose');
var Route = require('../models/Route');
var User = require('../models/User');

function defined(variable) {
  return (null != variable) && (typeof variable != 'undefined');
};

// Get all routes in DB
exports.getRoutes = function(req, res) {
  Route.find({}, function(err, routes) {
	// if there is an error retrieving, send the error. 
	if (err) {
		console.log(err.message);
		res.send(err);	
		// after that, nothing will execute
	}
    res.json(routes)
  });
};

// Get a route by ID in DB
exports.getRoute = function(req, res) {
  if (!req.body) return res.sendStatus(400);
  Route.findOne({ _id: req.params.id })
  .populate('user')
  .exec( function(err, route) {
	if ( defined(route) ) {
		console.log("Route with ID " + req.params.id + " retrieved in DB");
	} else {
		console.log("Cannot retrieve route with ID " + req.params.id + " in DB");
	}
    res.json(route);
  });
};

// Create a new route in DB
exports.createRoute = function(req, res) {
  if (!req.body) return res.sendStatus(400);
  User.findOne({ _id: req.body.user }, function(err, user) {
	// if there is an error retrieving, send the error. 
	if (err) {
		console.log(err.message);
		res.send(err);	
		// after that, nothing will execute
	}
	
	if ( defined(user) ) {
		console.log("User with ID " + req.body.user + " retrieved for route creation in DB");
		var route = new Route(req.body);
		route.user = user._id;
		route.save();
		console.log("Route with ID " + route._id + " created in DB");
		user.routes.push(route._id);
		user.save();
		console.log("Associated route to user with ID " + user._id + " in DB");
		res.json(route);
	} else {
		console.log("Cannot retrieve user with ID " + req.body.user + " to create route in DB");
		res.json(false);
	}
  });
};

// Update a route in DB
exports.updateRoute = function(req, res) {
  if (!req.body) return res.sendStatus(400);
  Route.findByIdAndUpdate(req.params.id, {
    $set: { description: req.body.description, waypoints: req.body.waypoints }
  }, { upsert: true },
  function(err, obj) {
	// if there is an error retrieving, send the error. 
	if (err) {
		console.log(err.message);
		res.send(err);	
		// after that, nothing will execute
	}
    return res.json(true);
  });
};

// Delete a route in DB
exports.deleteRoute = function(req, res) {
  if (!req.body) return res.sendStatus(400);
  Route.remove({ _id: req.params.id }, function(err) {
	// if there is an error retrieving, send the error. 
	if (err) {
		console.log(err.message);
		res.send(err);	
		// after that, nothing will execute
	}
	console.log("Route with ID " + req.params.id + " deleted in DB");
    res.json(true);
  });
};

// Get all users in DB
exports.getUsers = function(req, res) {
  User.find({}, function(err, users) {
	// if there is an error retrieving, send the error. 
	if (err) {
		console.log(err.message);
		res.send(err);	
		// after that, nothing will execute
	}
    res.json(users)
  });
};

// Get a user by ID in DB
exports.getUser = function(req, res) {
  if (!req.body) return res.sendStatus(400);
  User.findOne({ _id: req.params.id })
  .populate('routes')
  .exec( function(err, user) {
	// if there is an error retrieving, send the error. 
	if (err) {
		console.log(err.message);
		res.send(err);	
		// after that, nothing will execute
	}
	if ( defined(user) ) {
		console.log("User with ID " + req.params.id + " retrieved in DB");
	} else {
		console.log("Cannot retrieve user with ID " + req.params.id + " in DB");
	}
    res.json(user);
  });
};

// Create a new user in DB
exports.createUser = function(req, res) {
  if (!req.body) return res.sendStatus(400);
  var user = new User(req.body);
  user.save();
  console.log("User with ID " + user._id + " created in DB");
  res.json(user);
};

// Update a user in DB
exports.updateUser = function(req, res) {
  if (!req.body) return res.sendStatus(400);
  User.findByIdAndUpdate(req.params.id, {
    $set: { name: req.body.name, email: req.body.email, password: req.body.password }
  }, { upsert: true },
  function(err, obj) {
    // if there is an error retrieving, send the error. 
	if (err) {
		console.log(err.message);
		res.send(err);	
		// after that, nothing will execute
	}
    return res.json(true);
  });
};

// Delete a user in DB
// (also remove associated routes)
exports.deleteUser = function(req, res) {
  if (!req.body) return res.sendStatus(400);
  User.findOne({ _id: req.params.id })
  .exec( function(err, user) {
	// if there is an error retrieving, send the error. 
	if (err) {
		console.log(err.message);
		res.send(err);	
		// after that, nothing will execute
	}
	if ( defined(user) ) {
		console.log("User with ID " + req.params.id + " retrieved in DB");
		for (var i = 0; i < user.routes.length; i++) {
			Route.remove({ _id: user.routes[i] }, function(err) {
				// if there is an error retrieving, send the error. 
				if (err) {
					console.log(err.message);
					res.send(err);	
					// after that, nothing will execute
				}
				console.log("Route with ID " + user.routes[i] + " deleted in DB");
			});
		}
		User.remove({ _id: req.params.id }, function(err) {
			// if there is an error retrieving, send the error. 
			if (err) {
				console.log(err.message);
				res.send(err);	
				// after that, nothing will execute
			}
			console.log("User with ID " + req.params.id + " deleted in DB");
			res.json(true);
		});
	} else {
		console.log("Cannot retrieve user with ID " + req.params.id + " in DB");
	}
  });
};
