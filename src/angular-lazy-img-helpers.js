angular.module('angularLazyImg').factory('lazyImgHelpers', [
  '$window', function($window){
    'use strict';

    function getWinDimensions(){
      return {
        height: $window.innerHeight,
        width: $window.innerWidth
      };
    }

    function isElementInView(elem, offset, winDimensions) {
      var rect = elem.getBoundingClientRect();
      return (
        // check if any part of element is in view extented by an offset
       (rect.left <= winDimensions.width + offset) &&
       (rect.right >= 0 - offset) &&
       (rect.top <= winDimensions.height + offset) &&
       (rect.bottom >= 0 - offset)
      );
    }

    // http://remysharp.com/2010/07/21/throttling-function-calls/
    function throttle(fn, threshhold, scope) {
      var last, deferTimer;
      return function () {
        var context = scope || this;
        var now = +new Date(),
            args = arguments;
        if (last && now < last + threshhold) {
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function () {
            last = now;
            fn.apply(context, args);
          }, threshhold);
        } else {
          last = now;
          fn.apply(context, args);
        }
      };
    }

    return {
      isElementInView: isElementInView,
      getWinDimensions: getWinDimensions,
      throttle: throttle
    };
  }
]);
