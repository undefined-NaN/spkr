"use strict";

describe('PresentationsController', function() {
  var $scope, $rootScope, createController, $location, $window, Auth, Pres, $httpBackend;

  beforeEach(module('spkr'));
  beforeEach(inject(function($injector) {

    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    Auth = $injector.get('Auth');
    Pres = $injector.get('Pres');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');
    $location = $injector.get('$location');


    var $controller = $injector.get('$controller');

    createController = function() {
      return $controller('PresentationsController', {
        $scope: $scope,
        Auth: Auth,
        Pres: Pres,
        $location: $location,
        $window: $window
      });
    };
  }));

  xit('should have a submit method on the $scope', function() {
    createController();
    expect($scope.submit).to.be.a('function');
  });
});