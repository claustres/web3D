'use strict';

angular.module('web3D.Classes').factory('Viewer', function () {
  
  
  function Viewer(container, stats, debug) {
	this.stats = stats;
	this.debug = debug;
  
    try {
        this.viewer = new Cesium.Viewer(container);
    } catch (exception) {
        //loadingIndicator.style.display = 'none';
        var message = Cesium.formatError(exception);
        console.error(message);
        return false;
    }
	/*
	viewer.dropError.addEventListener(function(viewerArg, name, error) {
        showLoadError(name, error);
    });*/
	
	this.scene = this.viewer.scene;
    var context = this.scene.context;
    if (debug === true) {
        context.validateShaderProgram = true;
        context.validateFramebuffer = true;
        context.logShaderCompilation = true;
        context.throwOnWebGLError = true;
    }
	if (stats === true) {
        this.scene.debugShowFramesPerSecond = true;
    };
	
	//loadingIndicator.style.display = 'none';
	return true;
  }

  Viewer.prototype.showLoadError = function(name, error) {
        var title = 'An error occurred while loading the file: ' + name;
        var message = 'An error occurred while loading the file, which may indicate that it is invalid.  A detailed error report is below:';
        this.viewer.cesiumWidget.showErrorPanel(title, message, error);
    };

  Viewer.prototype.getTrackedEntity = function(source, dataSource, lookAt) {
	if (Cesium.defined(lookAt)) {
		var entity = dataSource.entities.getById(lookAt);
		if (Cesium.defined(entity)) {
			return entity;
		} else {
			var error = 'No entity with id "' + lookAt + '" exists in the provided data source.';
			this.showLoadError(source, error);
		}
	}
  }
  
  Viewer.prototype.loadSource = function(source, lookAt) {
        var dataSource;
        var loadPromise;
		var trackedEntity;
		var viewer = this.viewer;

        if (typeof source == "object") {
			dataSource = new Cesium.CzmlDataSource();
			dataSource.load(source, 'Built-in CZML');
		} else if (typeof source == "string") {
			if (/\.czml$/i.test(source)) {
				dataSource = new Cesium.CzmlDataSource(getFilenameFromUri(source));
				loadPromise = dataSource.loadUrl(source);
			} else if (/\.geojson$/i.test(source) || /\.json$/i.test(source) || /\.topojson$/i.test(source)) {
				dataSource = new Cesium.GeoJsonDataSource(getFilenameFromUri(source));
				loadPromise = dataSource.loadUrl(source);
			}
		} else {
            this.showLoadError(source, 'Unknown format.');
        }

        if (Cesium.defined(dataSource)) {
            this.viewer.dataSources.add(dataSource);

			if (Cesium.defined(loadPromise)) {
				loadPromise.then(function(dataSource, lookAt) {
					trackedEntity = this.getTrackedEntity(source, dataSource, lookAt);
				}).otherwise(function(error) {
					this.showLoadError(source, error);
				});
			} else {
				trackedEntity = this.getTrackedEntity(source, dataSource, lookAt);
			}
        }
		
		if ( Cesium.defined(trackedEntity) ) {
			this.viewer.clock.onTick.addEventListener(function(clock) {
				var position = trackedEntity.position.getValue(clock.currentTime);
				var cartographic = new Cesium.Cartographic();
				Cesium.Ellipsoid.WGS84.cartesianToCartographic(position, cartographic);
				viewer.scene.camera.setPositionCartographic(cartographic);
				viewer.scene.camera.moveBackward(10000);
			}
		)};
    }
	
	return Viewer;
});
