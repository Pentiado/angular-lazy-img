describe('Unit: lazy-img-helpers', function(){
  var lazyImgHelpers;
  beforeEach(angular.mock.module('angularLazyImg'));
  beforeEach(inject(function(_lazyImgHelpers_){
    lazyImgHelpers = _lazyImgHelpers_;
  }));

  describe('getWinDimensions', function() {
    it('should return window dimensions', function() {
      var dimensions = lazyImgHelpers.getWinDimensions();
      expect(dimensions.height).to.be.a('number');
      expect(dimensions.width).to.be.a('number');
    });
  });

  describe('isElementInView', function() {
    it('should return false when not in view', function(){
      $element = angular.element('<div style="width: 10px; height: 10px; position: absolute; top: -9999px;"></div>');
      angular.element(document.body).append($element);
      var inView = lazyImgHelpers.isElementInView($element[0], 0, {width: 100, height: 100});
      expect(inView).to.equal(false);
    });
    it('should return true when offset enough big', function(){
      $element = angular.element('<div style="width: 10px; height: 10px; position: absolute; top: -9999px;"></div>');
      angular.element(document.body).append($element);
      var inView = lazyImgHelpers.isElementInView($element[0], 999999, {width: 100, height: 100});
      expect(inView).to.equal(true);
    });
    it('should return true when in view', function(){
      $element = angular.element('<div style="width: 10px; height: 10px; position: absolute;"></div>');
      angular.element(document.body).append($element);
      var inView = lazyImgHelpers.isElementInView($element[0], 0, {width: 1000, height: 1000});
      expect(inView).to.equal(true);
    });
  });

  describe('throttle', function() {
    it('should run function maximum once per 30ms', function(){
      var fn = sinon.spy();
      var fnT = lazyImgHelpers.throttle(fn, 30);
      var i = 5;
      while(i--) fnT();
      expect(fn.calledOnce).to.be.ok;
    });
    it('should set proper this', function(){
      var thiz = {mega: 'dragon'};
      function fn(){
        expect(this).to.equal(thiz);
      }
      var fnT = lazyImgHelpers.throttle(fn, 30, thiz);
      fnT();
    });
  });
});