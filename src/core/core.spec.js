(function() {
  'use strict';

  describe('CoreTest', function () {
    var $analyticsProvider;
    var $windowProvider;
    var $window;

    var pageTrackFunction;
    var eventTrackFunction;
    var setUserPropertiesFunction;

    beforeEach(function() {
      $window = {};
      angular.mock.module('angulartics', function(_$analyticsProvider_, _$windowProvider_) {
        $analyticsProvider = _$analyticsProvider_;
        $windowProvider = _$windowProvider_;
        spyOn(_$analyticsProvider_, 'registerPageTrack').and.callFake(function (fn) {
          pageTrackFunction = fn;
        });
        spyOn(_$analyticsProvider_, 'registerEventTrack').and.callFake(function (fn) {
          eventTrackFunction = fn;
        });
        spyOn(_$analyticsProvider_, 'registerSetUserProperties').and.callFake(function (fn) {
          setUserPropertiesFunction = fn;
        });
        spyOn(_$windowProvider_, '$get').and.returnValue($window);
      });
      angular.mock.module('angulartics.tealium');
      angular.mock.inject();
    });

    it('Module should register event, page and properties functions', function() {
      //then
      expect($analyticsProvider.registerPageTrack).toHaveBeenCalled();
      expect($analyticsProvider.registerEventTrack).toHaveBeenCalled();
      expect($analyticsProvider.registerSetUserProperties).toHaveBeenCalled();
      expect($windowProvider.$get).toHaveBeenCalled();
      expect(pageTrackFunction).not.toBeNull();
      expect(eventTrackFunction).not.toBeNull();
      expect(setUserPropertiesFunction).not.toBeNull();
    });

    it('pageTrack should send window utag_data as view event and clear down utag_data', function() {
      //given
      var utagData = {expected: "data"};
      var utag = jasmine.createSpyObj('utag', ['view']);
      var path = '/some/path';
      $window.utag = utag;
      $window.utag_data = utagData;

      //when
      pageTrackFunction(path);

      //then
      var utagDataWithPath = {expected: "data", page_path: path};
      expect(utag.view).toHaveBeenCalledWith(utagDataWithPath);
      expect($window.utag_data).toEqual({});
    });

    it('eventTrack should send properties as link event and clear down utag_data', function() {
      //given
      var properties = {expected: "data"};
      var utag = jasmine.createSpyObj('utag', ['link']);
      var action = 'some-action';
      $window.utag = utag;
      $window.utag_data = {other: "data"};

      //when
      eventTrackFunction(action, properties);

      //then
      var propertiesWithEventSource = {expected: "data", event_source: action};
      expect(utag.link).toHaveBeenCalledWith(propertiesWithEventSource);
      expect($window.utag_data).toEqual({});
    });

    it('setUserProperties should add standardised properties to window utag_data', function() {
      //given
      var properties = {
        "expected": "data",
        "space seperated property" : "data",
        "camelCasedProperty" : "data",
        "dash-seperated-property" : "data",
        "ACRONYM" : "data"
      };
      $window.utag_data = {};

      //when
      setUserPropertiesFunction(properties);

      //then
      var expectedProperties = {
        "expected": "data",
        "space_seperated_property" : "data",
        "camel_cased_property" : "data",
        "dash_seperated_property" : "data",
        "acronym" : "data"
      };
      expect($window.utag_data).toEqual(expectedProperties);
    });
  });
}());