'use strict';

angular.module('main.controllers', [])
    .controller('HomeCtrl', ['$rootScope', '$scope', 'User', '$location', 'FormValidator',
        function ($rootScope, $scope, User, $location, FormValidator) {
            $rootScope.user = {};
            $scope.formvalidator = FormValidator;
            $rootScope.field = {
                chainDescription: ''
            };
            if (User.signedIn() && $rootScope.currentUser.username) {
                $location.path($rootScope.currentUser.username);
            }
            $scope.userService = User;
        }
    ])
    .controller('UserHomeCtrl', ['$rootScope', '$scope', '$routeParams', 'User', 'Chain',

        function ($rootScope, $scope, $routeParams, User, Chain) {
            var routeParamUsername = $routeParams.username;
            User.findUser(routeParamUsername);
            $rootScope.breakChain = function (breakReason) {
                Chain.breakChain(breakReason);
            };
            $scope.showBreak = function () {
                $rootScope.toggleModal('showBreak');
            };
            $scope.canEdit = function () {
                var result = ($rootScope.currentUser.username == routeParamUsername);
                return result;
            };
            $scope.userService = User;
            $scope.chain = Chain;
        }
    ])
    .controller('portalCtrl', ['$scope', '$rootScope', 'User', '$timeout', 'Chain',
        function ($scope, $rootScope, User, $timeout, Chain) {
            $rootScope.currentUser = null;
            $rootScope.message = null;
            $rootScope.showModal = false;
            $rootScope.selectModal = {};
            $rootScope.selectModal.signUp = false;
            $rootScope.selectModal.login = false;
            $rootScope.selectModal.breakchain = false;
            $scope.userService = User;

            $rootScope.login = function (user) {
                $rootScope.message = 'Logging In';
                User.login(user)
                    .then(function (user) {
                        $rootScope.currentUser = user;
                        $rootScope.userName = User.findByID(user.uid);
                        console.log($rootScope.userName);
                        $timeout(function () {
                            $rootScope.toggleModal('resetModal');
                        }, 1000);
                    }, function (error) {
                        console.dir(error);
                        $rootScope.message = error.code;
                    });

            };
            $rootScope.logout = function () {
                console.log('signing out');
                $rootScope.currentUser = null;
                User.logout();
            };
            $rootScope.toggleModal = function (selectedFunction, message, time) {
                $rootScope.showModal = !$rootScope.showModal;
                $rootScope[selectedFunction](message, time);
            };
            $rootScope.showSignUp = function () {
                $rootScope.selectModal.signUp = !$rootScope.selectModal.signUp;
            };
            $rootScope.showLogin = function () {
                $rootScope.selectModal.login = !$rootScope.selectModal.login;
            };
            $rootScope.showBreak = function () {
                $rootScope.selectModal.breakchain = !$rootScope.selectModal.breakchain;
            };
            $rootScope.showLogOut = function () {
                $rootScope.message = 'Succesfully logged out!';
                $rootScope.logout();
                $timeout(function () {
                    $rootScope.toggleModal('resetModal');
                }, 1000);
            };
            $rootScope.showMessage = function (message, time) {
                var time = time | 1000;
                $rootScope.message = message;
                $timeout(function () {
                    $rootScope.toggleModal('resetModal');
                }, time);
            }
            $rootScope.resetModal = function () {
                var property;
                $rootScope.message = '';
                for (property in $rootScope.selectModal) {
                    if ($rootScope.selectModal.hasOwnProperty(property)) {
                        $rootScope.selectModal[property] = false;
                    }
                }
            };

        }
    ])
    .controller('mainCtrl', ['$scope', 'Chain',

        function ($scope, Chain) {

        }
    ]);
