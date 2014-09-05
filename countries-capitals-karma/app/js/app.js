(function () {
    'use strict';
    angular.module('App', ['ngRoute', 'ngResource', 'ngAnimate', 'App.factories', 'App.controllers'])
        .run(['$rootScope', '$location', '$timeout',
            function ($rootScope, $location, $timeout) {
                $rootScope.$on('$routeChangeError', function () {
                    $location.path("/error");
                });
                $rootScope.$on('$routeChangeStart', function () {
                    $rootScope.isLoading = true;
                });
                $rootScope.$on('$routeChangeSuccess', function () {
                    $timeout(function () {
                        $rootScope.isLoading = false;
                    }, 200);
                });
            }
        ])
        .config(['$routeProvider',
            function ($routeProvider) {
                $routeProvider
                    .when('/', {
                        templateUrl: 'partials/home.html',
                        controller: 'homeCtrl'
                    })
                    .when('/countries', {
                        templateUrl: 'partials/countries.html',
                        controller: 'countriesCtrl'
                    })
                    .when('/countries/:country', {
                        templateUrl: 'partials/country.html',
                        controller: 'countryCtrl'
                    })
                    .when('/error', {
                        templateUrl: 'partials/error.html'
                    })
                    .otherwise({
                        redirectTo: '/error'
                    });
            }
        ]);
}());
