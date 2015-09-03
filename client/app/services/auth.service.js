    angular.module('spkr.auth.services', []);

        .factory('AuthService', function ($http, $location, $window) {

        var service = {};

        service.login = login;
        service.signup = signup;
        service.isAuth = isAuth;
        service.signout = signout;

        return service;

        var login = function (user) {
            return $http({
                method: 'POST',
                url: '/api/users/login',
                data: user
            })
            .then(function (res) {
                return res.data.token;
            })
        }
        var signup = function (user) {
            return $http({
                method: 'POST',
                url: '/api/users/signup',
                data: user
            })
            .then(function (res) {
                return res.data.token;
            })
        }

        var isAuth = function() {
            return !!$window.localStorage.getItem('com.spkr');
        }

        var signout = function (user) {
            $window.localStorage.removeItem('com.spkr');
            $location.path('/login');
        }
});
