angular.module('spkr', [
  'spkr.auth',
  'spkr.feedback-form',
  'spkr.homepage',
  'spkr.new-form',
  'spkr.previous-forms',
  'spkr.previous-pres',
  'spkr.services',
  'spkr.index',
  'ngRoute' 
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

    .when('/feedback-form', {
      templateUrl: 'app/feedback-form/feedback-form.html',
      controller: 'FeedbackController'
    })

    .when('/feedback-form/:id', {
      templateUrl: 'app/feedback-form/feedback-form.html',
      controller: 'FeedbackController'
    })

    .when('/history/:id', {
      templateUrl: 'app/previous-pres/previousPres.html',
      controller: 'PrevPresController'
    })

    .when('/data-profile', {
      templateUrl: 'app/homepage/homepage.html',
      controller: 'HomepageController'
    })

    .when('/presentations/new', {
      templateUrl: 'app/new-form/newForm.html',
      controller: 'NewFormController'
    })  

    .when('/presentations/history', {
      templateUrl: 'app/previous-forms/previousForms.html',
      controller: 'PrevFormsController'
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
