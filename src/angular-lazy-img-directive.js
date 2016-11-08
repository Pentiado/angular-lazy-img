angular.module('angularLazyImg')
  .directive('lazyImg', [
    '$rootScope', 'LazyImgMagic', function ($rootScope, LazyImgMagic) {
      'use strict';

      function link(scope, element, attributes) {
        scope.lazyImage = new LazyImgMagic(element);
        var deregister = attributes.$observe('lazyImg', function (newSource) {
          if (newSource) {
            deregister();
            scope.lazyImage.setSource(newSource);
          }
        });
        scope.$on('$destroy', function () {
          scope.lazyImage.removeImage();
        });
        $rootScope.$on('lazyImg.runCheck', function () {
          scope.lazyImage.checkImages();
        });
        $rootScope.$on('lazyImg:refresh', function () {
          scope.lazyImage.checkImages();
        });
      }

      return {
        link: link,
        restrict: 'A'
      };
    }
  ])
  .directive('lazyImgError', [
    function () {
      'use strict';

      function link(scope, element, attributes) {

        var deregister = scope.$watch('lazyImage', function(lazyImage) {
          lazyImage.setErrorSource(attributes.lazyImgError);
          deregister();
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
