angular.module('angularLazyImg').provider('lazyImgConfig', function() {
  'use strict';

  this.options = {
    offset       : 100,
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
});