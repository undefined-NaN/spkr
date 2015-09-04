// responsible for our client side authentication.

angular.module('spkr.auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};

  $scope.login = function () {
    Auth.login($scope.user)
      .then(function (token) {

        $window.localStorage.setItem('com.spkr', token);
        $location.path('/homepage');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.spkr', token);
        $location.path('/homepage');
      })
      .catch(function (error) {
        console.error(error);
      });
  };
});
