(function (angular) {
  'use strict'

  angular.module('demo-app', ['angularLazyImg'])
    .controller('appCtrl', function ($rootScope) {
      const randomColor = function () {
        return Math.floor(Math.random() * 16777215).toString(16);
      }

      const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'white', 'black'];

      this.images = (new Array(100)).fill(null).map(function (el, index) {
        return {
          id: index,
          randomColorName: colors[Math.floor(Math.random() * colors.length)],
          url: index % 5 ? 'http://placehold.it/3000x3000/' + randomColor() + '/ffffff' : 'http://wrong-url.doe'
        }
      });

      this.refresh = function () {
        $rootScope.$emit('lazyImg:refresh');
      };
    })
})(angular)
