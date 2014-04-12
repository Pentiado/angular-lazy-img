angular.module('angularLazyImg').directive('lazyImg', [
  'LazyImgMagic', function(LazyImgMagic){
    'use strict';

    function link(scope, element, attributes) {
      var observer, lazyImage;
      lazyImage = new LazyImgMagic(element);
      LazyImgMagic.addImage(element);
      observer = attributes.$observe('lazyImg', function(newSource){
        lazyImage.setSource(newSource);
        observer();
      });
      scope.$on('$destroy', function(){
        LazyImgMagic.removeImage(lazyImage);
      });
    }

    return({
      link: link,
      restrict: 'A'
    });
  }
]);