// responsible for our client side authentication.

angular.module('spkr.auth', [])

.controller('AuthController', function ($scope, $rootScope, $route, $window, $location, Auth) {
  $scope.user = {};
  //checks to make sure the user is logged in
  $scope.$watch(Auth.isAuth, function(authed){
    //if user is logged in, continue to their profile page
      if (authed) {
        $location.path('/data-profile');
      }
  }, true);
  //this function controls sets the token and userid when the login form is submitted
  $scope.login = function () {
    Auth.login($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('com.spkr', data.token);
        $window.localStorage.setItem('userid', data.userid);
        $location.path('/data-profile');
      })
      .catch(function (error) {
        $scope.user.error = "Username and/or password is incorrect.";
        console.error(error);
      });
  };
  //sets the token and userid when the signup form is submitted
  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('com.spkr', data.token);
        $window.localStorage.setItem('userid', data.userid);
        $location.path('/data-profile');
      })
      .catch(function (error) {
        //checks if the user is using a password that is longer than 8 characters
        var passLength= document.getElementById('password').value.length;
        if (passLength < 8) {
          $scope.user.error= "Password must be 8 characters or more!"
        }
        //checks to make sure the username does not already exist
        //and that the password is greater than 8 characters
        else if(passLength >=8) {
          $scope.user.error = "Username already exists!";
          console.error(error);}
        
      });
  };
});
