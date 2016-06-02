(function() {
  'use strict';

  UtagService.$inject = ["$window"];
  var tealiumModule = require('../angulartics-tealium.module');

  function UtagService($window) {

    var service = {
      load : load
    };
    return service;

    function load(config){
      $window.utag_cfg_ovrd = { noview : true };
      require('scriptloader')(
        'http://tags.tiqcdn.com/utag/' + 
        config.organisation + '/' + 
        config.application + '/' + 
        config.environment + 
        '/utag.js');
    }
  }

  tealiumModule.service('UtagService', UtagService);
  module.exports = UtagService;
}());
