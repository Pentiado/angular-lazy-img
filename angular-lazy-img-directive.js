angular.module('angularLazyImg').directive('lazyImg', [
  'LazyImgMagic', function(LazyImgMagic){
    'use strict';

    function link(scope, element, attributes) {
      var lazyImage;
      lazyImage = new LazyImgMagic(element);
      attributes.$observe('lazyImg', function(newSource){
        if (newSource){
          lazyImage.setSource(newSource);
        }
      });
      scope.$on('$destroy', function(){
        LazyImgMagic.removeImage(lazyImage);
      });
    }

    return {
      link: link,
      restrict: 'A'
    };
  }
]);