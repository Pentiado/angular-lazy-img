describe('Unit: lazy-img-logic', function(){
  var LazyImgMagic;
  beforeEach(angular.mock.module('angularLazyImg'));
  beforeEach(inject(function(_LazyImgMagic_){
    LazyImgMagic = _LazyImgMagic_;
  }));
  describe('new instance', function(){
    it('should create new instance with passed element and contain expected methods', function() {
      $element = angular.element('<img lazy-img="test.jpg" />');
      var lazyImage = new LazyImgMagic($element);
      expect(lazyImage.$elem).to.equal($element);
      expect(lazyImage.setSource).to.be.an('function');
      expect(lazyImage.removeImage).to.be.an('function');
    });
  });
});