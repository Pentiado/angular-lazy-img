/*
 * angular-lazy-load
 *
 * Copyright(c) 2014 Paweł Wszoła <wszola.p@gmail.com>
 * MIT Licensed
 *
 */

/**
 * @author Paweł Wszoła (wszola.p@gmail.com)
 *
 */

angular.module('angularLazyImg', []);

angular.module('angularLazyImg').factory('LazyImgMagic', [
  '$window', 'lazyImgConfig', 'lazyImgHelpers',
  function($window, lazyImgConfig, lazyImgHelpers){
    'use strict';

    var winDimensions, $win, images, count, isListening, options;
    var checkImagesT, saveWinOffsetT;

    images = [];
    count = 0;
    isListening = false;
    options = lazyImgConfig.getOptions();
    $win = angular.element($window);
    winDimensions = lazyImgHelpers.getWinDimensions();
    saveWinOffsetT = lazyImgHelpers.throttle(function(){
      winDimensions = lazyImgHelpers.getWinDimensions();
    }, 60);

    function checkImages(){
      for(var i = 0; i < count; i++){
        var image = images[i];
        if(lazyImgHelpers.isElementInView(image.$elem[0], options.offset, winDimensions)){
          loadImage(image);
          removeImage(i);
          i--;
        }
      }
      if(count === 0){ stopListening(); }
    }

    checkImagesT = lazyImgHelpers.throttle(checkImages, 30);

    function listen(param){
      (options.container || $win)[param]('scroll', checkImagesT);
      (options.container || $win)[param]('touchmove', checkImagesT);
      $win[param]('resize', checkImagesT);
      $win[param]('resize', saveWinOffsetT);
    }

    function startListenig(){
      isListening = true;
      setTimeout(function(){
        checkImages();
        listen('on');
      }, 1);
    }

    function stopListening(){
      isListening = false;
      listen('off');
    }

    function removeImage(i){
      images.splice(i, 1);
      count--;
    }

    function loadImage(photo){
      var img = new Image();
      img.onerror = function(){
        if(options.errorClass){
          photo.$elem.addClass(options.errorClass);
        }
        options.onError(photo);
      };
      img.onload = function(){
        setPhotoSrc(photo.$elem, photo.src);
        if(options.successClass){
          photo.$elem.addClass(options.successClass);
        }
        options.onSuccess(photo);
      };
      img.src = photo.src;
    }

    function setPhotoSrc($elem, src){
      if ($elem[0].nodeName.toLowerCase() === 'img') {
        $elem[0].src = src;
      } else {
        $elem.css('background-image', 'url("' + src + '")');
      }
    }

    // PHOTO
    function Photo($elem){
      this.$elem = $elem;
    }

    Photo.prototype.setSource = function(source){
      this.src = source;
      images.push(this);
      count++;
      if (!isListening){ startListenig(); }
    };

    Photo.prototype.removeImage = function(){
      var index = images.indexOf(this);
      removeImage(index);
      if(count === 0){ stopListening(); }
    };

    return Photo;

  }
]);
angular.module('angularLazyImg').provider('lazyImgConfig', function() {
  'use strict';

  this.options = {
    offset       : 100,
    errorClass   : null,
    successClass : null,
    onError      : function(){},
    onSuccess    : function(){}
  };

  this.$get = function() {
    var options = this.options;
    return {
      getOptions: function() {
        return options;
      }
    };
  };

  this.setOptions = function(options) {
    angular.extend(this.options, options);
  };
});
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
      var bottomline = winDimensions.height + offset;
      return (
       rect.left >= 0 && rect.right <= winDimensions.width + offset && (
         rect.top >= 0 && rect.top <= bottomline ||
         rect.bottom <= bottomline && rect.bottom >= 0 - offset
        )
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