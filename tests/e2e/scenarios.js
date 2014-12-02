'use strict';

describe('web3D', function() {

  browser.get('index.html');

  it('should automatically redirect to /viewer when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/viewer");
  });


  describe('viewer', function() {

    beforeEach(function() {
      browser.get('index.html#/viewer');
    });


    it('should render viewer when user navigates to /viewer', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('map', function() {

    beforeEach(function() {
      browser.get('index.html#/map');
    });


    it('should render map when user navigates to /map', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
