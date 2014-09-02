angular.module('App.controllers', [])
    .controller('homeCtrl', ['$rootScope',
        function ($rootScope) {
            $rootScope.button = {
                home: false,
                browse: true
            };
        }
    ])
    .controller('countriesCtrl', ['$scope', '$rootScope', '$location', 'GeoAPI',
        function ($scope, $rootScope, $location, GeoAPI) {
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


        }
    ])
    .controller('countryCtrl', ['$scope', '$rootScope', '$routeParams', 'GeoAPI',
        function ($scope, $rootScope, $routeParams, GeoAPI) {
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

        }
    ]);
