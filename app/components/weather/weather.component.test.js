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
    }));

    it('component should not be loading if request has been made', function() {
        expect(ctrl.isLoading).toBe(true);
    });

    it('should not have an error when the component renders', function(){
        expect(ctrl.isError).toBe(false);
    });

    it('should search for the entered query', function(){
        expect(ctrl.search('Detroit',true)).toBe(true);
    });

  });

});