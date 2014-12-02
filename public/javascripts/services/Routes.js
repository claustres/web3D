'use strict';

angular.module('web3D.Services').factory('RouteService', function($resource) {
  return $resource("/api/routes/:id", { id: "@id" },
    {
      'create':  { method: 'POST' },
      'getAll':   { method: 'GET', isArray: true },
      'get':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'delete':  { method: 'DELETE' }
    }
  );
});
