angular.module('angularLazyImg', []);

angular.module('angularLazyImg', []).factory('LazyImgMagic', [
  '$window', 'lazyImgConfig', 'lazyImgHelpers',
  function($window, lazyImgConfig, lazyImgHelpers){
    'use strict';

    var winDimensions, $win, images, count, isListening, options;
    var checkImagesT, saveWinOffsetT;

    images = [];
    isListening = false;
    options = lazyImgConfig.getOptions();
    $win = angular.element($window);
    winDimensions = lazyImgHelpers.getWinDimensions();
    saveWinOffsetT = lazyImgHelpers.throttle(function(){
      winDimensions = lazyImgHelpers.getWinDimensions();
    }, 50);

    function checkImages() {
      for(var i = 0; i < count; i++){
        var image = images[i];
        if(lazyImgHelpers.isElementInView(image.elem, lazyImgConfig.offset, winDimensions)) {
          loadImage(image);
          removeImage(i);
          i--;
        }
      }
      if(count === 0){ stopListening(); }
    }

    checkImagesT = lazyImgHelpers.throttle(checkImages, 25);

    function listen(param){
      $win[param]('scroll', checkImagesT);
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
      if(photo.elem.offsetWidth > 0 && photo.elem.offsetHeight > 0) {
        var img = new Image();
        img.onerror = function() {
          if(photo.onError){ photo.onError(); }
          photo.elem.addClass(options.errorClass);
        };
        img.onload = function() {
          setPhotoSrc(photo.elem, photo.src);
          photo.addClass(options.successClass);
          if(photo.success){ photo.success(); }
        };
        img.src = photo.src;
      }
    }

    function setPhotoSrc($elem, src){
      var isImage = $elem.nodeName.toLowerCase() === 'img';
      isImage ? $elem.src = src : $elem.css('background-image', 'url("' + src + '")');
    }

    // PHOTO
    function Photo($elem){
      this.$elem = $elem;
    }

    Photo.prototype.setSource = function(source){
      this.src = source;
      images.push(this);
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