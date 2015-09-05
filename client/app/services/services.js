angular.module('spkr.services', [])

.factory('Auth', function ($http, $location, $window) {
  // Don't touch this Auth service!!!
  // it is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'com.spkr'
  // after you login/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
  var login = function (user) {
    console.log('inside login')
    return $http({

      method: 'POST',
      url: '/api/users/login',
      data: user
    })
    .then(function (res) {
      return res.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (res) {
      return res.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.spkr');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.spkr');
    $location.path('/landing');
  };

// this is standard to return an object of these factory functions
  return {
    login: login,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
})






// factory for feedback form 

.factory('FeedbackService', function ($http, $location, $window) {
    var submitFeedback = function(user,presentation) {
      return $http({
        method: 'POST',
        url: 'api/users/presentation/name',
        data: presentation
      }).then(function(res){
        return res.data;
      })
    };

    return {
      submitFeedback: submitFeedback
    };
}).

factory('Pres', function ($http, $location, $window) {
    var createPresentation = function(presentation) {
      console.log('in Pres#createPresentation', presentation);
      return $http({
        method: 'POST',
        url: 'api/presentations/',
        data: presentation
      }).then(function(res){
        return res.data;
      })
    };

    return {
      createPresentation: createPresentation
    };
})