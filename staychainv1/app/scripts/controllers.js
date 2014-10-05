'use strict';

angular.module('main.controllers', [])
    .controller('HomeCtrl', ['$rootScope', '$scope', 'Auth', 'Chain', '$location',
        function ($rootScope, $scope, Auth, Chain, $location) {
            $rootScope.field = {
                chainDescription: ''
            };
            if (Auth.signedIn() && $rootScope.currentUser.username) {
                $location.path($rootScope.currentUser.username);
            }
            $scope.auth = Auth;
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
                return result
            };
        }
    ])
    .controller('ChainDetailsCtrl', ['$scope',
        function ($scope) {
            // comming
        }
    ])
    .controller('portalCtrl', ['$scope', 'Auth', '$rootScope', 'User', '$timeout', 'Chain',
        function ($scope, Auth, $rootScope, User, $timeout, Chain) {
            $scope.originalUser = {};
            $scope.user = {};
            $rootScope.currentUser = null;
            $rootScope.message = null;
            $rootScope.showModal = false;
            $rootScope.selectModal = {};
            $rootScope.selectModal.signUp = false;
            $rootScope.selectModal.login = false;
            $rootScope.selectModal.breakchain = false;
            $scope.checkPassword = function (user, form) {
                form.repeatPassword.$setValidity("match", user.password == user.repeatPassword);
            };

            function registerSuccess(authUser) {
                $rootScope.message = 'Signing In';
                console.log(authUser);
                User.create(authUser, $scope.user);
                return $scope.user;
            }

            function errorHandler(error) {
                console.dir(error);
                $rootScope.message = error.code;
            }
            $rootScope.signUp = function (user) {
                if (!user.password && !user.email) {
                    $rootScope.message = "Please fill out form completely";
                }
                Auth.register(user)
                    .then(registerSuccess, errorHandler)
                    .then(function (user) {
                        console.log('236');
                        Auth.login(user)
                            .then(function () {
                                console.log('238');
                                console.log($rootScope.field.chainDescription);
                                Chain.startChain($rootScope.field.chainDescription);
                                $timeout(function () {
                                    $rootScope.toggleModal('resetModal');
                                }, 1000);
                            }, errorHandler);
                    });
            };
            $rootScope.resetForm = function () {
                $scope.user = angular.copy($scope.originalUser);
            };
            $rootScope.login = function (user) {
                $rootScope.message = 'Logging In';
                Auth.login(user)
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
                Auth.logout();
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
    .controller('mainCtrl', ['$scope', 'Auth', 'Chain',

        function ($scope, Auth, Chain) {

        }
    ]);
