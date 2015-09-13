angular.module('spkr.services', [])

.factory('Auth', function ($http, $rootScope, $location, $window) {
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
      return res.data;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (res) {
      return res.data;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.spkr');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.spkr');
    $window.localStorage.removeItem('userid');
    $rootScope.withBackground = true;
    $location.path('/');
  };

  var getAllData = function(){
    var userid = $window.localStorage.getItem('userid');
    return $http({
      method: 'GET',
      url: 'api/users/' + userid,
    }).then(function(res){
      return res.data;
    })
  };

// this is standard to return an object of these factory functions
  return {
    login: login,
    signup: signup,
    isAuth: isAuth,
    signout: signout,
    getAllData: getAllData
  };
})
// factory for feedback form 

.factory('FeedbackService', function ($http, $location, $window) {
    var submitFeedback = function(presentation) {
      console.log(presentation, " i am inside the factory")
      return $http({
        method: 'POST',
        url: 'api/feedback/',
        data: presentation
      }).then(function(res){
        return res.data;
      })
    };

    return {
      submitFeedback: submitFeedback
    };
})

.factory('Pres', function ($http, $location, $window) {
    var createPresentation = function(presentation) {
      var userid = $window.localStorage.getItem('userid');
      presentation.userid = userid;
      console.log('in Pres#createPresentation', presentation);
      return $http({
        method: 'POST',
        url: 'api/presentations/',
        data: presentation
      }).then(function(res){
        return res.data;
      })
    };

    var getData = function(id){
      return $http({
        method: 'GET',
        url: 'api/presentations/' + id,
      }).then(function(res){
        return res.data;
      })
    };

    return {
      createPresentation: createPresentation,
      getData: getData
    };
})