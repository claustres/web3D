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

  Viewer.prototype.showLoadError = function(error) {
        var title = 'An error occurred while loading the source: ' + this.source;
        var message = 'An error occurred while loading the source, which may indicate that it is invalid.  A detailed error report is below:';
        this.viewer.cesiumWidget.showErrorPanel(title, message, error);
    };

  Viewer.prototype.getTrackedEntity = function() {
	if (Cesium.defined(this.lookAt)) {
		this.trackedEntity = this.viewer.dataSources.get(0).entities.getById(this.lookAt);
		if (Cesium.defined(this.trackedEntity)) {
			return this.trackedEntity;
		} else {
			var error = 'No entity with id "' + lookAt + '" exists in the provided data source.';
			this.showLoadError(error);
		}
	}
  }
  
  Viewer.prototype.loadSource = function(source, lookAt) {
        var dataSource;
		var loadPromise;
		this.lookAt = lookAt;
		this.source = source;
		
        if (typeof source == "object") {
			dataSource = new Cesium.CzmlDataSource();
			dataSource.load(source, 'Built-in CZML');
		} else if (typeof source == "string") {
			if (/\.czml$/i.test(source)) {
				dataSource = new Cesium.CzmlDataSource();
				loadPromise = dataSource.loadUrl(source);
			} else if (/\.geojson$/i.test(source) || /\.json$/i.test(source) || /\.topojson$/i.test(source)) {
				dataSource = new Cesium.GeoJsonDataSource();
				loadPromise = dataSource.loadUrl(source);
			}
		} else {
            this.showLoadError(source, 'Unknown format.');
        }

        if (Cesium.defined(dataSource)) {
            this.viewer.dataSources.add(dataSource);

			if (Cesium.defined(loadPromise)) {
				loadPromise.then(function() {
					this.getTrackedEntity();
				}.bind(this)).otherwise(function(error) {
					this.showLoadError(source, error);
				}.bind(this));
			} else {
				this.getTrackedEntity();
			}
        }
		
		this.viewer.clock.onTick.addEventListener(function(clock) {
			if ( Cesium.defined(this.trackedEntity) ) {
				var position = this.trackedEntity.position.getValue(clock.currentTime);
				var cartographic = new Cesium.Cartographic();
				Cesium.Ellipsoid.WGS84.cartesianToCartographic(position, cartographic);
				this.viewer.scene.camera.setPositionCartographic(cartographic);
				this.viewer.scene.camera.twistRight(1.3);
				this.viewer.scene.camera.lookUp(1.3);
				this.viewer.scene.camera.moveBackward(10000);
			}
		}.bind(this));
    }
	
	return Viewer;
});
