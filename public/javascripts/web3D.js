'use strict';

// Declare app level module which depends on controllers, filters, and services

var app = angular.module('web3D', [
  'ngRoute',
  'ngResource',
  'ui.bootstrap',
  'web3D.Classes',
  'web3D.Services',
  'web3D.Controllers'
]).
config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/viewer', {
      templateUrl: 'partials/viewer',
      controller: 'ViewerController'
    }).
    when('/map', {
      templateUrl: 'partials/map',
      controller: 'MapController'
    }).
    otherwise({
      redirectTo: '/viewer'
    });

  $locationProvider.html5Mode(true);
}]);

// Define module for classes
angular.module('web3D.Classes', []);

// Define modules for controllers, services, etc.
angular.module('web3D.Services', ['web3D.Classes']);
angular.module('web3D.Controllers', ['web3D.Services']);
