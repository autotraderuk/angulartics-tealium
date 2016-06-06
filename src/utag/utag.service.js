(function() {
  'use strict';

  UtagService.$inject = ["$window", "$q"];
  var tealiumModule = require('../angulartics-tealium.module');

  function UtagService($window, $q) {
    
    var deferred = $q.defer();

    var service = {
      load : load,
      loaded: deferred.promise
    };
    return service;
    
    function load(config){
      $window.utag_cfg_ovrd = { noview : true };
      require('scriptloader')(
        'http://tags.tiqcdn.com/utag/' + config.organisation + '/' + config.application + '/' + config.environment + '/utag.js'
      ).addEventListener('load', function() {
        deferred.resolve(true);
      });
    }
  }

  tealiumModule.service('UtagService', UtagService);
  module.exports = UtagService;
}());
