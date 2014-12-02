module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'public/javascripts/vendor/require/build/require.js',
	  'public/javascripts/vendor/CesiumUnminified/Cesium.js',
	  'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js',
	  'public/javascripts/vendor/angular/angular.js',
	  'public/javascripts/vendor/angular-mocks/angular-mocks.js',
	  'public/javascripts/vendor/angular-route/angular-route.js',
	  'public/javascripts/vendor/angular-resource/angular-resource.js',
	  'public/javascripts/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
	  'public/javascripts/web3D.js',
	  'public/javascripts/controllers/*.js',
	  'public/javascripts/services/*.js',
	  'tests/unit/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'tests/unit/unit.xml',
      suite: 'unit'
    }

  });
};