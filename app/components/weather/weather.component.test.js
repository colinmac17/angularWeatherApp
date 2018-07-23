describe('weather', function() {
  // Load the module that contains the `phoneList` component before each test
  beforeEach(module('weather'));

  // Test the controller
  describe('WeatherController', function() {
    var $httpBackend, ctrl;

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service and assign it to a variable with the same name
    // as the service while avoiding a name conflict.
    beforeEach(inject(function($componentController, _$httpBackend_) {
      $httpBackend = _$httpBackend_;
      ctrl = $componentController('weather');
      $httpBackend.expectGET(ctrl.search('Detroit',true)).respond({});
    }));

    it('should search for Detroit and return some data `$http`', function() {
        console.log(ctrl.search('Detroit'));
        $httpBackend.flush();
        expect(status.status).toBe(200);
    });

    // it('should set a default value for the `orderProp` property', function() {
    //   expect(ctrl.orderProp).toBe('age');
    // });

  });

});