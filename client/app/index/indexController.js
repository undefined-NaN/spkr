angular.module('spkr.index', ['ui.bootstrap'])
  .controller('IndexController', function ($scope, $route, $routeParams, $window, $location, Auth) {
  $scope.loggedIn = false;
  $scope.isCollapsed = false;
  console.log($scope.isCollapsed);
  $scope.$watch(Auth.isAuth, function(authed){
     $scope.loggedIn = authed;
   }, false);
});