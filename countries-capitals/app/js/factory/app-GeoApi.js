(function () {
    'use strict';
    angular.module('App.factories', [])
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
}());
