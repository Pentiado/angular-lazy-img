angular.module('angularLazyImg')
  .directive('lazyImg', [
    '$rootScope', '$log', 'LazyImgMagic', function ($rootScope, $log, LazyImgMagic) {
      'use strict';

      function link(scope, element, attributes) {
        scope.lazyImage = new LazyImgMagic(element);
        scope.lazyImage.setErrorSource(attributes.lazyImgError);
        var deregister = attributes.$observe('lazyImg', function (newSource) {
          if (newSource) {
            deregister();
            scope.lazyImage.setSource(newSource);
          }
        });

        var eventsDeregister = $rootScope.$on('lazyImg:refresh', function () {
          scope.lazyImage.checkImages();
        });

        scope.$on('$destroy', function () {
          scope.lazyImage.removeImage();
          eventsDeregister();
        });
      }

      return {
        link: link,
        restrict: 'A'
      };
    }
  ])
  .directive('lazyImgContainer', [
    'LazyImgMagic', function (LazyImgMagic) {
      'use strict';

      function link(scope, element) {
        LazyImgMagic.addContainer(element);
        scope.$on('$destroy', function () {
          LazyImgMagic.removeContainer(element);
        });
      }

      return {
        link: link,
        restrict: 'A'
      };
    }
  ]);
