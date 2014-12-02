'use strict';

angular.module('web3D.Services').factory('UserService', function($resource) {
  return $resource("/api/users/:id", { id: "@id" },
    {
      'create':  { method: 'POST' },
      'getAll':   { method: 'GET', isArray: true },
      'get':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'delete':  { method: 'DELETE' }
    }
  );
});
