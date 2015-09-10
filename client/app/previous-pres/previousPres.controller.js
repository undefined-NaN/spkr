angular.module('spkr.previous-pres', ['ngRoute'])
  .controller('PrevPresController', function ($scope, $location, $routeParams, Pres, Auth) {

    $scope.$watch(Auth.isAuth, function(authed) {
      if (authed) {
        $location.path('/history/'+$routeParams.id);
      } else {
        $location.path('/landing')
      }
    }, true);

    Pres.getData($routeParams.id)
    .then(function(data){
      $scope.title = data.title;
      $scope.date  = data.date.slice(0,10);
      $scope.feedbacks = data.feedbacks.length;
      $scope.feedbackUrl = "http://localhost:8000/#/feedback-form/" + $routeParams.id;
    })
    .catch(function(error){
      $location.path('/profile')
    })

  });
