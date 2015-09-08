"use strict";

describe('NewFormController', function () {
  var $scope, $rootScope, createController, Auth, Pres, $httpBackend;

  beforeEach(module('spkr'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    Auth = $injector.get('Auth');
    Pres = $injector.get('Pres');    
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('NewFormController', {
        $scope: $scope,
        Auth: Auth,
        Pres: Pres
      });
    };
  }));

  it('should have a submit method on the $scope', function () {
    createController();
    expect($scope.submit).to.be.a('function');
  });
});