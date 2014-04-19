describe('Unit: lazy-img-provider', function() {
  var lazyImgConfigProvider;
  beforeEach(function(){
    var fakeModule = angular.module('test.app', []);
    fakeModule.config(function(_lazyImgConfigProvider_){
      lazyImgConfigProvider = _lazyImgConfigProvider_;
    });
    module('angularLazyImg', 'test.app');
    inject(function () {});
  });
  describe('setOptions', function() {
    it('should set expected options', function() {
      var options = {offset: 200, errorClass: 'blah'};
      lazyImgConfigProvider.setOptions(options);
      var resultOptions = lazyImgConfigProvider.$get().getOptions();
      expect(resultOptions.offset).to.equal(200);
      expect(resultOptions.errorClass).to.equal('blah');
    });
    it('should contains default options', function() {
      var options = lazyImgConfigProvider.$get().getOptions();
      expect(options).to.include.keys(['offset', 'errorClass', 'successClass', 'onError', 'onSuccess']);
    });
  });
});
