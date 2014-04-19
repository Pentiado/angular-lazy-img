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

    function checkImages() {
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
      if(photo.$elem[0].offsetWidth > 0 && photo.$elem[0].offsetHeight > 0) {
        var img = new Image();
        img.onerror = function() {
          if(options.errorClass){
            photo.$elem.addClass(options.errorClass);
          }
          options.onError(photo);
        };
        img.onload = function() {
          setPhotoSrc(photo.$elem, photo.src);
          if(options.successClass){
            photo.$elem.addClass(options.successClass);
          }
          options.onSuccess(photo);
        };
        img.src = photo.src;
      }
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