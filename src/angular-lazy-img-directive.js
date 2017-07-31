angular.module('angularLazyImg')
  .directive('lazyImg', [
    '$rootScope', 'LazyImgMagic', '$log', function ($rootScope, $log, LazyImgMagic) {
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
          if($rootScope.lazyImgRefreshEvents) {
            for (var i = 0; i< $rootScope.lazyImgRefreshEvents.length; i++) {
              $rootScope.lazyImgRefreshEvents[i]();
            }
            $rootScope.lazyImgRefreshEvents = [];
          }
        });
        $rootScope.$on('lazyImg.runCheck', function () {
          $log.warn('Deprecated. Use lazyImg:refresh instead');
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
        if(!$rootScope.lazyImgRefreshEvents) {
          $rootScope.lazyImgRefreshEvents = [];
        }
        $rootScope.lazyImgRefreshEvents.push($rootScope.$on('lazyImg:refresh', function () {
          lazyImage.checkImages();
        }));
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
