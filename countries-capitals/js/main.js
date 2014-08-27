(function() {
    'use strict'
    angular.module('mainApp', ['ngRoute', 'ngResource', 'ngAnimate'])
        .run(function($rootScope, $location, $timeout) {
            $rootScope.$on('$routeChangeError', function() {
                $location.path("/error");
            });
            $rootScope.$on('$routeChangeStart', function() {
                $rootScope.isLoading = true;
            });
            $rootScope.$on('$routeChangeSuccess', function() {
                $timeout(function() {
                    $rootScope.isLoading = false;
                }, 200);
            });
        })
        .config(function($routeProvider) {
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
                    template: 'partials/error.html'
                })
                .otherwise({
                    redirectTo: '/error'
                });
        })
        .factory('geoApi', ['$http', '$route',
            function($http, $route) {

                return ({
                    getCountries: getCountries
                });

                function getCountries() {
                    var endpoint = "http://api.geonames.org/countryInfoJSON?username=hirekris";
                    return $http({
                            method: 'GET',
                            cache: true,
                            url: endpoint
                        })
                        .then(success, error);
                };

                function success(response) {
                    return (response.data);
                }

                function error(response) {
                    throw (response.data.message);
                }
            }
        ])
        .controller('homeCtrl', function($scope, $rootScope, geoApi) {
            $rootScope.button = {
                home: false,
                browse: true
            }
        })
        .controller('countriesCtrl', function($scope, $rootScope, geoApi) {
            geoApi.getCountries()
                .then(function(response) {
                    $scope.countries = response.geonames;
                });

            $scope.countryInfo = function(countryCode) {
                alert(countryCode);
            }
            $rootScope.button = {
                home: true,
                browse: false
            }

        })
        .controller('countryCtrl', function($scope, $rootScope, geoApi) {

        });
})();
