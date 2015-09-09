describe('AuthController', function() {
  var $scope, $rootScope, $location, $window, $httpBackend,
    createController, Auth;

  // using angular mocks, we can inject the injector to retrieve our dependencies
  beforeEach(module('spkr'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    $httpBackend = $injector.get('$httpBackend');
    Auth = $injector.get('Auth');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    // used to create our AuthController for testing
    createController = function() {
      return $controller('AuthController', {
        $scope: $scope,
        $window: $window,
        $location: $location,
        Auth: Auth
      });
    };

    createController();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.localStorage.removeItem('com.spkr');
  });

  it('should have a signup method', function() {
    expect($scope.signup).to.be.a('function');
  });

  it('should store token in localStorage after signup', function() {
    // create a fake JWT for auth
    var token = 'sjj232hwjhr3urw90rof';

    // make a 'fake' reques to the server, not really going to our server
    $httpBackend.expectPOST('/api/users/signup').respond({
      token: token
    });
    $scope.signup();
    $httpBackend.flush();
    expect($window.localStorage.getItem('com.spkr')).to.be(token);
  });

  it('should have a login method', function() {
    expect($scope.login).to.be.a('function');
  });

  it('should store token in localStorage after login', function() {
    // create a fake JWT for auth
    var token = 'sjj232hwjhr3urw90rof';
    $httpBackend.expectPOST('/api/users/login').respond({
      token: token
    });
    $scope.login();
    $httpBackend.flush();
    expect($window.localStorage.getItem('com.spkr')).to.be(token);
  });
});