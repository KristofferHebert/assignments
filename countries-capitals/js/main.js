(function() {
    angular.module('App', ['ngRoute', 'ngAnimate'])
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
                    templateUrl: 'home.html'
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
        .factory()
        .controller()

})();
