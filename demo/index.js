(function (angular) {
  'use strict'

  angular.module('demo-app', ['angularLazyImg'])
    .controller('appCtrl', function () {
      const randomColor = function () {
        return Math.floor(Math.random() * 16777215).toString(16);
      }

      this.images = (new Array(100)).fill(null).map(function (el, i) {
        return i % 5 ? 'http://placehold.it/3000x3000/' + randomColor() + '/ffffff' : 'http://wrong-url.doe';
      });
    })
})(angular)
