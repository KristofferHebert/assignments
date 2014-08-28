(function () {
    'use strict';
    angular.module('mainApp', ['ngRoute', 'ngResource', 'ngAnimate'])
        .run(function ($rootScope, $location, $timeout) {
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
        })
        .config(function ($routeProvider) {
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
        .factory('GeoAPI', ['$http', '$route',
            function ($http) {
                function request(endpoint) {
                    return $http({
                        method: 'GET',
                        cache: true,
                        url: endpoint
                    });
                }

                function getCountries() {
                    var endpoint = "http://api.geonames.org/countryInfoJSON?username=hirekris";
                    return request(endpoint);
                }

                function getCountry(country) {
                    var endpoint = "http://api.geonames.org/countryInfoJSON?username=hirekris&country=" + country;
                    return request(endpoint);
                }

                function getNeighbor(ID) {
                    var endpoint = "http://api.geonames.org/neighboursJSON?geonameId=" + ID + "&username=hirekris";
                    return request(endpoint);
                }

                function getCapital(country) {
                    var endpoint = "http://api.geonames.org/searchJSON?formatted=true&q=capital&&style=full&country=" + country + "&username=hirekris";
                    return request(endpoint);
                }

                return {
                    getCountries: getCountries,
                    getCountry: getCountry,
                    getNeighbor: getNeighbor,
                    getCapital: getCapital
                };

            }
        ])
        .controller('homeCtrl', function ($rootScope) {
            $rootScope.button = {
                home: false,
                browse: true
            };
        })
        .controller('countriesCtrl', function ($scope, $rootScope, $location, GeoAPI) {
            $rootScope.button = {
                home: true,
                browse: false
            };
            GeoAPI.getCountries()
                .then(function (response) {
                    $scope.countries = response.data.geonames;
                    return $scope.countries;
                }, function () {
                    throw ('Something went wrong');
                });

            $scope.countryInfo = function (countryCode) {
                $location.path('/countries/' + countryCode);
            };

        })
        .controller('countryCtrl', function ($scope, $rootScope, $routeParams, GeoAPI) {
            $rootScope.button = {
                home: true,
                browse: true
            };
            var country = $routeParams.country;
            GeoAPI.getCountry(country)
                .then(function (response) {
                    $scope.country = response.data.geonames[0];
                }, function (response) {
                    throw (response.data.message);
                })
                .then(function () {
                    GeoAPI.getNeighbor($scope.country.geonameId)
                        .then(function (response) {
                            $scope.neighbours = response.data.geonames;
                        });

                });
            GeoAPI.getCapital(country)
                .then(function (response) {
                    $scope.capitalPopulation = response.data.geonames[0].population;
                });

        });
}());
