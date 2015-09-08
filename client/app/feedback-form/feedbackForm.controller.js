angular.module('spkr.feedback-form', ['ngRoute'])
  .controller('FeedbackController', function ($scope, $location, $routeParams, FeedbackService) {
    $scope.presentation= {
      // date: 'guest',
      // name: 'guest',
      organization: 0,
      clarity: 0,
      volume: 0,
      posture: 0,
      prepared: 0,
      visualAids: 0,
      connect: 0,
      question: 0,
      overall: 0
    },

    
  // add in submitFeedback function to be able to call it on feedbackForm.html for ng-click Submit
    $scope.submitFeedback = function (presentation) {
      var presId = $routeParams.id
      presentation.presId = presId;
      FeedbackService.submitFeedback(presentation) // inputs may be changed
        .then (function () {
          console.log('successfully sent feedback POST request')
        })
        .catch (function (error) {
          console.err(error);
        })
    }
  });


