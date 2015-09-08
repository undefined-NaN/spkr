// responsible for our client side authentication.

angular.module('spkr.auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};

  $scope.login = function () {
    console.log('inside Auth.login')
    Auth.login($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('com.spkr', data.token);
        $window.localStorage.setItem('userid', data.userid);
        $location.path('/homepage');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('com.spkr', data.token);
        $window.localStorage.setItem('userid', data.userid);
        $location.path('/homepage');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  // $scope.signout= function () {
  //   Auth.signout()
      
  // };
});
