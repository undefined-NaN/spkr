angular.module('spkr.previous-forms', [])
  .controller('PrevFormsController', function ($scope, $window, $location, Auth) {

    $scope.$watch(Auth.isAuth, function(authed){
      if (authed) {
        $location.path('/previous-forms');
      } else {
        $location.path('/landing')
      } 
    }, true);
  })