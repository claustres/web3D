'use strict';

angular.module('web3D.Classes').factory('Map', function () {

  function Map(container) {
    this.map = L.map(container);
	
	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(this.map);
  };
  
  Map.prototype.locate = function() {
	this.map.locate({setView: true, maxZoom: 16});
  };
  
  return Map;
  
});
