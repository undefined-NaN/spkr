// user creates a new presentation to generate a form
angular.module('spkr.new-form', [])
  .controller('NewFormController', function ($scope, $location, $window, Auth) {

        $scope.$watch(Auth.isAuth, function(authed){
      if (authed) {
        $location.path('/new-form');
      } else {
        $location.path('/login')
      } 
    }, true);
  })

