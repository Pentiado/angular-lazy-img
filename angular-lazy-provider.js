angular.module('angularLazyImg').provider('lazyImgConfig', [
  '$window', function($window) {
    'use strict';

    this.options = {
      error        : false,
      success      : false,
      offset       : 100,
      win          : angular.element($window),
      errorClass   : 'lazy-error',
      successClass : 'lazy-success'
    };

    this.$get = function() {
      var options = this.options;
      return {
        getOptions: function() {
          return options;
        }
      };
    };

    this.setOptions = function(options) {
      angular.extend(this.options, options);
    };
  }
]);