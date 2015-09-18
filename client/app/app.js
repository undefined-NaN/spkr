angular.module('spkr', [
  'spkr.auth',
  'spkr.feedback-form',
  'spkr.homepage',
  'spkr.previous-pres',
  'spkr.presentations',
  'spkr.services',
  'spkr.index',
  'spkr.background',
  'ngRoute',
  'ui.bootstrap',
  // 'ngFx',
  'ngAnimate'
  ]
)

.config(function($routeProvider, $httpProvider) {
  $routeProvider

    .when('/', {
      templateUrl: 'app/auth/landing.html',
      controller: 'AuthController'
    })

    .when('/login', {
      templateUrl: 'app/auth/login.html',
      controller: 'AuthController'
    })

    .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })

    // .when('/landing', {
    //   templateUrl: 'app/auth/landing.html',
    //   controller: 'AuthController'
    // })

    .when('/about', {
      templateUrl: 'app/about/about.html'
    })

    .when('/feedback-form', {
      templateUrl: 'app/feedback-form/feedback-form.html',
      controller: 'FeedbackController'
    })

    .when('/feedback-form/:id', {
      templateUrl: 'app/feedback-form/feedback-form.html',
      controller: 'FeedbackController'
    })

    .when('/presentations', {
      templateUrl: 'app/presentations/presentations.html'
    })

    .when('/presentations/history/:id', {
      templateUrl: 'app/previous-pres/previousPres.html',
      controller: 'PrevPresController'
    })

    .when('/data-profile', {
      templateUrl: 'app/homepage/homepage.html',
      controller: 'HomepageController'
    })

    .when('/logout', {
      templateUrl: 'app/auth/landing.html',
      controller: 'AuthController',
      resolve:{ function (Auth){
        Auth.signout();
      }

      }
    })
    .otherwise('/')

});
