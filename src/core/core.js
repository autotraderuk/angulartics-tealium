(function() {
  'use strict';

  var tealiumModule = require('../angulartics-tealium.module');

  // UtagProxy prevents us from constructing multiple UtagService when we load services.
  // This is important as UtagService must be a singleton as it holds some promise state.
  UtagProxy.$inject = ["UtagService"];
  function UtagProxy(UtagService) {
    return UtagService;
  }
  tealiumModule.service("UtagProxy", UtagProxy);

  Configuration.$inject = ["$windowProvider", "$analyticsProvider", "$injector", "_"];
  function Configuration($windowProvider, $analyticsProvider, $injector, _) {

    var $window;
    var UtagService;

    //We can't guarantee the window is ready yet
    try {
      $windowProvider.$get().utag_data = {};
    } catch(e) {
      console.error('Window service not available', e);
    }

    $analyticsProvider.registerPageTrack(pageTrack);
    $analyticsProvider.registerEventTrack(eventTrack);
    $analyticsProvider.registerSetUserProperties(setUserProperties);

    function loadServicesIfRequired(){
      if(!$window) {
        $window = $windowProvider.$get();
      }
      if(!UtagService){
        UtagService = $injector.get('UtagProxyProvider').$get();
      }
    }

    function pageTrack(path) {
      loadServicesIfRequired();
      UtagService.loaded.then(function() {
        if($window.utag.view && path) {
          var utag_data = $window.utag_data || {};
          utag_data.page_path = path;
          $window.utag.view(utag_data);
        }
        $window.utag_data = {};
      });
    }

    function eventTrack(action, properties) {
      loadServicesIfRequired();
      UtagService.loaded.then(function() {
        if ($window.utag.link && properties) {
          var utag_data = buildStandardisedProperties(properties);
          utag_data.event_source = action;
          $window.utag.link(utag_data);
        }
        $window.utag_data = {};
      });
    }

    function setUserProperties(properties) {
      loadServicesIfRequired();
      if (properties) {
        var standardisedProperties = buildStandardisedProperties(properties);
        for (var key in standardisedProperties) {
          if (standardisedProperties.hasOwnProperty(key)) {
            $window.utag_data[key] = standardisedProperties[key];
          }
        }
      }
    }

    function buildStandardisedProperties(properties) {
      var standardisedProperties = {};
      for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
          var standardisedKey = _.snakeCase(key);
          standardisedProperties[standardisedKey] = properties[key];
        }
      }
      return standardisedProperties;
    }
  }
  tealiumModule.config(Configuration);
}());
