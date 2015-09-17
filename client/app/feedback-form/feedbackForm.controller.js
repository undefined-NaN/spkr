angular.module('spkr.feedback-form', ['ngRoute'])
  .controller('FeedbackController', function ($scope, $location, $routeParams, FeedbackService, Pres, Auth) {

    var presId = $routeParams.id;
    $scope.loggedIn = Auth.isAuth(),
    $scope.title,
    $scope.date,
    $scope.expiration,
    $scope.today,
    $scope.user,

    $scope.presentation= {
      // date: 'guest',
      // name: 'guest',
      organization: 7,
      clarity: 7,
      volume: 7,
      posture: 7,
      prepared: 7,
      visualAids: 7,
      connect: 7,
      question: 7,
      overall: 7,
      comments: null
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
        $scope.date  = data.date.slice(0,10);
        $scope.today = new Date().toISOString().split('T')[0];
        $scope.expiration = data.expiration.slice(0,10);
      })
      .catch(function(error){
        $location.path('/data-profile')
      })
    }

    $scope.autoExpand = function(e) {
        var element = typeof e === 'object' ? e.target : document.getElementById(e);
        var scrollHeight = element.scrollHeight -60; // replace 60 by the sum of padding-top and padding-bottom
        element.style.height =  scrollHeight + "px";    
    };
  
    function expand() {
      $scope.autoExpand('TextArea');
    }

    $scope.getData();
  });


