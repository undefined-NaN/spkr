"use strict";

describe('FeedbackController', function() {
  var $scope, $rootScope, createController, FeedbackService, $httpBackend;

  beforeEach(module('spkr'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    FeedbackService = $injector.get('FeedbackService');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function() {
      return $controller('FeedbackController', {
        $scope: $scope,
        FeedbackService: FeedbackService
      });
    };
  }));

  // it('should have a data property on $scope.user.presentation', function() {
  //   createController();
  //   expect($scope.user.presentation).to.be.an('object');
  // });

  it('should have a submitFeedback method on the $scope', function() {
    createController();
    expect($scope.submitFeedback).to.be.a('function');
  });
});