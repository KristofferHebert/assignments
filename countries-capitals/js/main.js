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
                    templateUrl: 'partials/home.html'
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
        .controller('countriesCtrl', function($scope, geoApi) {
            geoApi.getCountries()
                .then(function(response) {
                    $scope.countries = response.geonames;
                });

            $scope.countryInfo = function(countryCode) {
                alert(countryCode);
            }

        })
        .controller('countryCtrl', function($scope, geoApi) {

        });
})();
