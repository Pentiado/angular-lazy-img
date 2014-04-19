angular.module('angularLazyImg').directive('lazyImg', [
  'LazyImgMagic', function(LazyImgMagic){
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
    }

    return {
      link: link,
      restrict: 'A'
    };
  }
]);