/*!
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
(function () {
    'use strict';

    var querySelector = document.querySelector.bind(document);

    var navdrawerContainer = querySelector('.navdrawer-container');
    var body = document.body;
    var appbarElement = querySelector('.app-bar');
    var menuBtn = querySelector('.menu');
    var main = querySelector('main');

    function closeMenu() {
        body.classList.remove('open');
        appbarElement.classList.remove('open');
        navdrawerContainer.classList.remove('open');
    }

    function toggleMenu() {
        body.classList.toggle('open');
        appbarElement.classList.toggle('open');
        navdrawerContainer.classList.toggle('open');
        navdrawerContainer.classList.add('opened');
    }

    main.addEventListener('click', closeMenu);
    menuBtn.addEventListener('click', toggleMenu);
    navdrawerContainer.addEventListener('click', function (event) {
        if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
            closeMenu();
        }
    });

    angular.module('main', ['firebase', 'ngRoute'])
        .constant("FIREBASE_URL", "https://staychain.firebaseio.com")
        .run(['$rootScope', '$firebase', 'FIREBASE_URL', 'User', 'Auth', '$location',

            function ($rootScope, $firebase, FIREBASE_URL, User, Auth, $location) {
                $rootScope.currentUser = null;
                $rootScope.$on('$firebaseSimpleLogin:login', function (e, user) {
                    var Username = User.findByID(user.uid);
                    $rootScope.currentUser = user;
                    Username.$loaded(function () {
                        $rootScope.currentUser.username = Username.username;
                        if (Auth.signedIn && $rootScope.currentUser.username) $location.path($rootScope.currentUser.username);
                    });

                });


            }
        ])
        .config(['$routeProvider',
            function ($routeProvider) {
                $routeProvider
                    .when('/', {
                        templateUrl: '../partials/home.html',
                        controller: 'HomeCtrl'
                    })
                    .when('/:username', {
                        templateUrl: '../partials/profile.html',
                        controller: 'UserHomeCtrl'
                    })
                    .when('/:username/:chain', {
                        templateUrl: '../partials/chain.html',
                        controller: 'ChainDetailsCtrl'
                    })
                    .otherwise({
                        redirectTo: '/'
                    });

            }
        ])
        .controller('HomeCtrl', ['$rootScope', '$scope', 'Auth', 'Chain', '$location',

            function ($rootScope, $scope, Auth, Chain, $location) {
                if (Auth.signedIn && $rootScope.currentUser.username) $location.path($rootScope.currentUser.username);

                $scope.startChain = function (chainDescription) {
                    Chain.startChain(chainDescription);
                };
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
            }
        ])
        .controller('ChainDetailsCtrl', ['$scope',
            function ($scope) {

            }
        ])
        .factory('Auth',

            function ($firebaseSimpleLogin, $rootScope, FIREBASE_URL) {
                var ref = new Firebase(FIREBASE_URL),
                    auth = $firebaseSimpleLogin(ref),
                    Auth = {};

                Auth.register = function (user) {
                    return auth.$createUser(user.email, user.password);
                };
                Auth.signedIn = function () {
                    return auth.user !== null;
                };
                Auth.login = function (user) {
                    return auth.$login('password', user);
                };
                Auth.logout = function () {
                    return auth.$logout();
                };

                $rootScope.signIn = function () {
                    return Auth.signedIn();
                };
                return Auth;
            })
        .directive('chainLink', ['Chain',
            function (Chain) {
                return {
                    restrict: 'E',
                    templateUrl: '../partials/chainLink.html',
                    scope: {
                        chains: '=data'
                    },
                    controller: function ($scope) {
                        $scope.getChainLength = Chain.getChainLength;

                        $scope.renderChainLinks = function (chainDate) {
                            var output = "",
                                chainStart = new Date(chainDate.start),
                                chainEnd = new Date(chainDate.end),
                                length;
                            if (!chainDate.end.length == 0) {
                                length = $scope.getChainLength(chainStart, chainEnd);
                            } else {
                                length = $scope.getChainLength(chainStart);
                                if (length === 0) {
                                    output = "You just started, checkback tomorrow to see your chain grow!";
                                }
                            }
                            while (length--) {
                                output += "[=====]";
                            }
                            if (chainDate.end) {
                                output += "[==Z==]";
                            }

                            return output;

                        };

                    }
                };
            }
        ])
        .controller('mainCtrl', ['$scope', 'Auth', 'Chain',

            function ($scope, Auth, Chain) {

            }
        ])
        .controller('portalCtrl', ['$scope', 'Auth', '$rootScope', 'User', '$timeout',
            function ($scope, Auth, $rootScope, User, $timeout) {
                $scope.originalUser = {};
                $scope.user = {};
                $rootScope.currentUser = null;
                $rootScope.message = null;
                $rootScope.showModal = false;
                $rootScope.selectModal = {};
                $rootScope.selectModal.signUp = false;
                $rootScope.selectModal.login = false;
                $rootScope.selectModal.breakchain = false;
                $scope.checkPassword = function (user) {
                    $scope.signup.repeatPassword.$error.pwmatch = user.password !== user.repeatPassword;
                };

                function registerSuccess(authUser) {
                    $rootScope.message = 'Signing In';
                    console.log(authUser);
                    User.create(authUser, $scope.user);
                    $rootScope.toggleModal('resetModal');
                    Auth.login($scope.user)
                        .then(function () {});
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
                            Auth.login(user);
                        }, errorHandler);
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
                    $rootScope.currentUser = {};
                    Auth.logout();
                };
                $scope.checkPassword = function () {
                    $scope.signup.repeatPassword.$error.dontMatch = $scope.user.password !== $scope.user.repeatPassword;
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
        .factory('Chain', ['$firebase', '$rootScope', 'User', 'Auth', 'FIREBASE_URL',

            function ($firebase, $rootScope, User, Auth, FIREBASE_URL) {

                var Chain = {
                    getChainLength: function (a, b) {
                        var _MS_PER_DAY = 1000 * 60 * 60 * 24,
                            utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()),
                            utc2;
                        if (b) {
                            utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

                        } else {
                            var now = new Date();
                            utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

                        }

                        return Math.floor((utc2 - utc1) / _MS_PER_DAY);

                    },
                    startChain: function (chainDescription) {
                        if ($rootScope.signIn() && chainDescription) {
                            Chain.addFirstChain(chainDescription);
                        } else {
                            $rootScope.toggleModal('showMessage', 'Please add a chain description.');
                        }

                    },
                    addChain: function () {
                        var ID = $rootScope.currentUser.uid;
                        var today = new Date()
                            .toDateString(),
                            chain = {
                                start: today,
                                end: '',
                                reason: ''
                            },
                            index = parseInt($rootScope.goals[0].chains.length, 10);
                        $rootScope.goals[0].chains[index] = chain;
                        $rootScope.goals.$save(0);

                    },
                    breakChain: function (breakReason) {
                        var ID = $rootScope.currentUser.uid,
                            index = parseInt($rootScope.goals[0].chains.length - 1, 10),
                            endDate = new Date()
                            .toDateString(),
                            startDate = new Date($rootScope.goals[0].chains[index].start),
                            chainRecord = Chain.chainLength(startDate);

                        $rootScope.goals[0].chains[index].end = endDate;
                        $rootScope.goals[0].chains[index].reason = breakReason;
                        $rootScope.goals[0].record = parseInt($rootScope.goals[0].record);
                        if ($rootScope.goals[0].record < chainRecord) {
                            // do nothing
                        } else {
                            $rootScope.goals[0].record = chainRecord;
                        }

                        Chain.addChain();
                        $rootScope.showMessage('Breaking Chain..', 2000);

                    },
                    addFirstChain: function (chainDescription) {
                        var ID = $rootScope.currentUser.uid,
                            startDate = new Date()
                            .toDateString();
                        var goalRef = $firebase(new Firebase(FIREBASE_URL + '/users/' + ID + '/goals/0'))
                            .$asArray();

                        goalRef.$add({
                            ID: '',
                            record: '',
                            summary: chainDescription,
                            chains: [{
                                start: startDate,
                                end: '',
                                reason: ''
                            }]
                        });
                    }
                };

                return Chain;
            }
        ])
        .factory('User', function ($firebase, FIREBASE_URL, Auth, $rootScope) {
            var ref = new Firebase(FIREBASE_URL + '/users'),
                User = {
                    create: function (authUser, user) {
                        var userSchema = $firebase(ref.child(authUser.uid))
                            .$asObject(),
                            userNameList = $firebase(ref.child('username')
                                .child(user.username));


                        userSchema.$loaded(function () {
                            var data = {
                                'id': authUser.uid
                            };
                            userNameList.$update(data);
                        });

                        return userSchema.$loaded(function () {
                            userSchema.id = authUser.uid;
                            userSchema.username = user.username;
                            userSchema.email = user.email;
                            userSchema.goals = [];
                            userSchema.md5_hash = authUser.md5_hash;
                            userSchema.$priority = authUser.uid;
                            userSchema.$save();
                        });
                    },
                    findByUsername: function (username) {
                        if (username) {
                            var ref = new Firebase(FIREBASE_URL + '/users/username/' + username);
                            console.log('Trying to find user by username');
                            return $firebase(ref)
                                .$asObject();
                        }
                    },
                    findByID: function (ID) {
                        if (ID) {
                            var ref = new Firebase(FIREBASE_URL + '/users/' + ID);
                            console.log('Trying to find user by user by ID');
                            return $firebase(ref)
                                .$asObject();
                        }
                    },
                    findUser: function (username) {
                        var user = User.findByUsername(username)
                        user.$loaded(function () {
                            var userID = user.id,
                                userData = User.findByID(userID),
                                userGoal = User.findUserGoals(userID);
                            userData.$loaded(function () {
                                $rootScope.UserHomeData = userData;
                            });
                            userGoal.$loaded(function () {
                                $rootScope.goals = userGoal;
                            });
                        });
                    },
                    findUserGoals: function (ID) {
                        return $firebase(new Firebase(FIREBASE_URL + '/users/' + ID + '/goals/0'))
                            .$asArray();
                    }
                };

            return User;
        });

})();

/*
  todo
  add chain link record length
  create unit tests
  add logic to prevent duplicate usernames
  add graphic for chains
  move menu js to directive
  move modal code from portcrl to modal directive
  break up controllers, services, directives, into seperate js files
  make sure code can be minified
  tidy up controllers
  move timeout to modal flash message function
  tidy up security
  remove console.logs
  fix firebase goals array bugs
*/
