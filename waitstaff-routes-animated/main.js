angular.module('waitStaff', ['ngRoute', 'ngAnimate'])
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
        $routeProvider.when('/', {
            templateUrl: 'home.html',
            activetab: 'home'
        })
            .when('/new-meal', {
                templateUrl: 'new-meal.html',
                controller: 'mealCtrl',
                activetab: 'newmeal'
            })
            .when('/my-earnings', {
                templateUrl: 'my-earnings.html',
                controller: 'earningCtrl',
                activetab: 'myearnings'
            })
            .when('/error', {
                template: '<section><h1>Error: Page not found</h1></section>'
            })
            .otherwise({
                redirectTo: '/error'
            });
    })
    .factory('Calculator', function() {
        var data = {
            subTotal: 0,
            tip: 0,
            total: 0,

            tipTotal: 0,
            mealCount: 0,
            averageTip: 0,
            input: {
                base: '',
                tax: '',
                percentage: ''
            }
        };

        return {
            get: function() {
                return data;
            },
            calculate: function() {
                data.subTotal = data.input.base + (data.input.base * (data.input.tax * .01));
                data.tip = data.subTotal * (data.input.percentage * .01);
                data.total = data.subTotal + data.tip;
                data.mealCount++;
                data.tipTotal += data.tip;
                data.averageTip = (data.tipTotal / data.mealCount);
            },
            resetEarnings: function() {
                data.tipTotal = 0;
                data.mealCount = 0;
                data.averageTip = 0;
                data.subTotal = '';
                data.tip = '';
                data.total = '';
            },
            resetForm: function() {
                data.input.base = '';
                data.input.tax = '';
                data.input.percentage = '';
            },
        }

    })
    .controller('mainCtrl', function($scope, $route) {
        $scope.$route = $route;
    })
    .controller('mealCtrl', function($scope, Calculator) {
        $scope.data = Calculator.get();
        $scope.submitForm = function() {
            if ($scope.mealDetails.$valid) {
                Calculator.calculate();
                $scope.resetForm();
            } else {
                alert('The form is invalid');
            }
        };
        $scope.resetForm = function() {
            Calculator.resetForm();
            $scope.mealDetails.$setPristine();
        };

    })
    .controller('earningCtrl', function($scope, Calculator) {
        $scope.data = Calculator.get();
        $scope.resetEarnings = Calculator.resetEarnings;
    });
