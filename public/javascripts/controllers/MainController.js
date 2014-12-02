'use strict';

angular.module('web3D.Controllers').controller('MainController', function ($scope, $q, UserService, RouteService) {
    
	$scope.viewerInitialized = false;
	$scope.isViewerInitialized = function() { return $scope.viewerInitialized; };
	
	// Restore test DB
    UserService.create(
	{
	  "name" :"Luc Claustres",
	  "email" : "luc.claustres@orange.fr",
	  "password" : "kltp;97w"
	})
	.$promise
	.then( function (data) {
		console.log("User with ID " + data._id + " created");

		return UserService.get( { id : data._id } ).$promise;
	}, function (data) {
		console.log("Cannot create user");
    })
	.then(function (data) {
		$scope.user = data;
		console.log("User with ID " + data._id + " retrieved");
		
		return RouteService.create(
		{
		  "user" : data._id,
		  "description" :"My first route",
		  "waypoints" :[43.551347,7.012753,45.923056,6.869722]
		}).$promise;
	}, function (data) {
		console.log("Cannot retrieve user");
    })
	.then(function (data) {
		console.log("Route with ID " + data._id + " created");
		
		return UserService.get( { id : $scope.user._id } ).$promise;
	}, function (data) {
		console.log("Cannot create route");
    })
	.then(function (data) {
		$scope.user = data;
		console.log("User with ID " + data._id + " and route with ID " + data.routes[0]._id + " retrieved");
		
		return UserService.delete( { id : $scope.user._id } ).$promise;
	}, function (data) {
		console.log("Cannot retrieve user and route");
    })
	.then(function (data) {
		console.log("User with ID " + $scope.user._id + " deleted");
	}, function (data) {
		console.log("Cannot delete user");
	})
	// will be called as soon as an exception
	// or failure happens further up the chain
	.catch (function(error) {
		console.log("Something went wrong : " + error);
	})
	// will always be executed
	.finally(function() {
		console.log('This will always be called...');
	});
 });
 