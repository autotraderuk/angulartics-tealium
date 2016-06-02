(function() {
  'use strict';

  Configuration.$inject = ["$windowProvider", "$analyticsProvider", "_"];
  var tealiumModule = require('../angulartics-tealium.module');

  function Configuration($windowProvider, $analyticsProvider, _) {

    var $window = $windowProvider.$get();
    $window.utag_data = {};
    
    $analyticsProvider.registerPageTrack(pageTrack);
    $analyticsProvider.registerEventTrack(eventTrack);
    $analyticsProvider.registerSetUserProperties(setUserProperties);

    function pageTrack(path) {
      if($window.utag && $window.utag.view && path) {
        var utag_data = $window.utag_data || {};
        utag_data.page_path = path;
        $window.utag.view(utag_data);
      }
      $window.utag_data = {};
    }

    function eventTrack(action, properties) {
      if($window.utag && $window.utag.link && properties) {
        var utag_data = buildStandardisedProperties(properties);
        utag_data.event_source = action;
        $window.utag.link(utag_data);
      }
      $window.utag_data = {};
    }

    function setUserProperties(properties) {
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
