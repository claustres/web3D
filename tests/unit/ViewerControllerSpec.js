describe('ViewerController unit test suite', function(){

var scope, ViewerController;

// Load the controller module
beforeEach( function(){ module('web3D.Controllers'); } );

beforeEach( inject(function($controller, $rootScope) {
  scope = $rootScope.$new();
  ViewerController = $controller('ViewerController', {$scope : scope});
}));

it('Controller should initialize viewer in debug mode', function () {
  expect(scope.stats).toBe(true);
  expect(scope.debug).toBe(true);
});

});
