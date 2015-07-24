angular.module('angularLazyImg').directive('lazyImg', [
  '$rootScope', 'LazyImgMagic', function($rootScope, LazyImgMagic){
    'use strict';

    function link(scope, element, attributes) {
      var lazyImage = new LazyImgMagic(element);
      attributes.$observe('lazyImg', function(newSource){
        if (newSource){
          // in angular 1.3 it might be nice to remove observer here
          lazyImage.setSource(newSource);
        }
      });
      scope.$on('$destroy', function(){
        lazyImage.removeImage();
      });
      $rootScope.$on('lazyImg.runCheck', function() {
          lazyImage.checkImages();
      });
    }

    return {
      link: link,
      restrict: 'A'
    };
  }
]);
