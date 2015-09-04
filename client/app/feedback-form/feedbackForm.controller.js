angular.module('spkr.feedback-form', [])
  .controller('FeedbackController', function ($scope, $location, FeedbackService) {
    $scope.user.presentation = {
      date: 'guest',
      name: 'guest',
      organization: 0,
      clarity: 0,
      volume: 0,
      posture: 0,
      prepared: 0,
      visualAids: 0,
      connect: 0,
      question: 0,
      overall: 0
    };

  // add in submitFeedback function to be able to call it on feedbackForm.html for ng-click Submit
    $scope.submitFeedback = function () {
      FeedbackService.submitFeedback($scope.user, $scope.user.presentation) // inputs may be changed
        .then (function () {
          console.log('successfully sent feedback POST request')
        })
        .catch (function (error) {
          console.err(error);
        })
    }
  });


