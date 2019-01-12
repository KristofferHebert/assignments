(function () {
    'use strict';

    angular.module('App', [])
        .controller('mainCtrl', ['$scope', 'Data',

            function ($scope, Data) {
                $scope.data = "Test";
                window.data = $scope.data;
                $scope.clickTest = function () {
                    var endpoint = "http://api.geonames.org/countryInfoJSON?username=hirekris";
                    $scope.loading = true;

                    Data.get(endpoint, function (response) {
                        $scope.data = response;
                        $scope.loading = false;
                    });

                };
            }
        ])
        .factory('Data', ['$http',
            function ($http) {

                function request(endpoint) {
                    return $http({
                        method: 'GET',
                        cache: true,
                        url: endpoint
                    });
                }

                function get(url, callback) {
                    request(url)
                        .success(callback)
                        .error(function (err) {
                            throw (err);
                        });
                }

                return {
                    get: get
                };

            }
        ]);
}());
