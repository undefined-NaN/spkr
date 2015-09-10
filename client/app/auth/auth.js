// responsible for our client side authentication.

angular.module('spkr.auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};

  $scope.login = function () {
    Auth.login($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('com.spkr', data.token);
        $window.localStorage.setItem('userid', data.userid);
        $location.path('/profile');
      })
      .catch(function (error) {
        $scope.user.error = "Username and/or password is incorrect.";
        console.error(error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('com.spkr', data.token);
        $window.localStorage.setItem('userid', data.userid);
        $location.path('/profile');
      })
      .catch(function (error) {
        $scope.user.error = "Username already exists!";
        console.error(error);
      });
  };
});
