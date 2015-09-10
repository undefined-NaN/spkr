angular.module('spkr.feedback-form', ['ngRoute'])
  .controller('FeedbackController', function ($scope, $location, $routeParams, FeedbackService, Pres, Auth) {

    var presId = $routeParams.id;
    $scope.loggedIn = Auth.isAuth(),
    $scope.title,
    $scope.date,
    $scope.user,

    $scope.presentation= {
      // date: 'guest',
      // name: 'guest',
      organization: 50,
      clarity: 50,
      volume: 50,
      posture: 50,
      prepared: 50,
      visualAids: 50,
      connect: 50,
      question: 50,
      overall: 50
    },

    
  // add in submitFeedback function to be able to call it on feedbackForm.html for ng-click Submit
    $scope.submitFeedback = function (presentation) {
      presentation.presId = presId;
      FeedbackService.submitFeedback(presentation) // inputs may be changed
        .then (function (data) {
          $scope.feedbackSuccess = data.data
        })
        .catch (function (error) {
          console.log(error)
        })
    },

    $scope.getData = function(){
      Pres.getData(presId)
      .then(function(data){
        $scope.user = data._presenter.username;
        $scope.title = data.title;
        $scope.date  = data.date
      })
      .catch(function(error){
        $location.path('/profile')
      })
    }

    $scope.getData();
  });


