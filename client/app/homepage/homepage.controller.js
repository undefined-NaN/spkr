angular.module('spkr.homepage', [])
  .controller('HomepageController', function ($scope, $window, $location, Auth) {

    $scope.$watch(Auth.isAuth, function(authed){
    if (authed) {
      $location.path('/homepage');
    } else {
      $location.path('/login')
    } 
  }, true);

})