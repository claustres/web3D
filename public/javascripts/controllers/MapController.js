'use strict';

angular.module('web3D.Controllers').controller('MapController', function ($scope, Map) {

  $scope.initializeMap = function(container) {
    $scope.map = new Map(container);
	$scope.map.locate();
  };
});
