(function () {
e
  angular
    .module('app', ['ngRoute'])
    .config(config);

  config.$inject = [ '$routeProvider', '$locationProvider'];

  function config($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        controller: 'LandingController',
        templateUrl: 'landing/landing.html'
      })

      .when('/signin', {
        controller: 'SignInController',
        templateUrl: 'session/signin.html'
      })

      .when('/signup', {
        controller: 'SignUpController',
        templateUrl: 'session/signup.html'
      })

      .otherwise({ redirectTo: '/signin' })
  }














})