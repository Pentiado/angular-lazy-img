angular.module('angularLazyImg', []);

angular.module('angularLazyImg', []).factory('LazyImgMagic', [
  '$window', '$document', 'lazyImgConfig', function(lazyImgConfig){
    'use strict';

    var winWidth, winHeight, images, count, isListening, options;
    var checkImagesT, saveWinOffsetT;

    images = [];
    isListening = false;
    options = lazyImgConfig.getOptions();

    function saveWinOffset(){
      winHeight = window.innerHeight;
      winWidth = window.innerWidth;
    }

    // http://remysharp.com/2010/07/21/throttling-function-calls/
    function throttle(fn, threshhold, scope) {
      var last, deferTimer;
      return function () {
        var context = scope || this;
        var now = +new Date,
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

    checkImagesT = throttle(checkImages, 25);
    saveWinOffsetT = throttle(saveWinOffset, 50);
    saveWinOffset();

    function listen(param){
      lazyImgConfig.win[param]('scroll', checkImagesT);
      lazyImgConfig.win[param]('resize', checkImagesT);
      lazyImgConfig.win[param]('resize', saveWinOffsetT);
    }

    function startListenig(){
      isListening = true;
      setTimeout(function(){ checkImages(); }, 1);
      listen('on');
    }

    function stopListenig(){
      isListening = false;
      listen('off');
    }

    function checkImages() {
      for(var i = 0; i < count; i++){
        var image = images[i];
        if(isElementInView(image)) {
          loadImage(image);
          images.splice(i, 1);
          count--;
          i--;
        }
      }
      if(count === 0) stopListening();
    }

    function loadImage(photo){
      if(photo.elem.offsetWidth > 0 && photo.elem.offsetHeight > 0) {
        var img = new Image();
        img.onerror = function() {
          if(photo.onError) photo.onError();
          photo.elem.addClass(options.errorClass);
        };
        img.onload = function() {
          setPhotoSrc(photo.elem, photo.src);
          photo.addClass(options.successClass);
          if(photo.success) photo.success();
        };
        img.src = photo.src;
      }
    }

    function setPhotoSrc($elem, src){
      var isImage = $elem.nodeName.toLowerCase() === 'img';
      isImage ? $elem.src = src : $elem.css('background-image', 'url("' + src + '")');
    }

    function isElementInView(ele) {
      var rect = ele.getBoundingClientRect();
      var bottomline = winHeight + options.offset;
      return (
       rect.left >= 0 && rect.right <= winWidth + options.offset && (
         rect.top  >= 0 && rect.top  <= bottomline ||
         rect.bottom <= bottomline && rect.bottom >= 0 - options.offset
        )
      );
    }

  }
]);