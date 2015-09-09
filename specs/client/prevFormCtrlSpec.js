"use strict";

describe('PrevFormsController', function () {
  var $scope, $rootScope, createController, Auth, $httpBackend;

  beforeEach(module('spkr'));
  beforeEach(inject(function($injector) {

  $rootScope = $injector.get('$rootScope');
  $httpBackend = $injector.get('$httpBackend');
  Auth = $injector.get('Auth');
  $scope = $rootScope.$new();

  var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('PrevFormsController', {
        $scope: $scope,
        Auth: Auth
      });
    };
  }));

});