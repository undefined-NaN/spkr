angular.module('spkr.index', [])
  .controller('IndexController', function ($scope, $window, $location, Auth) {
  $scope.loggedIn = false;
  $scope.$watch(Auth.isAuth, function(authed){
     $scope.loggedIn = authed;
   }, false);
});