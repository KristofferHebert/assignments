'use strict';

angular.module('main.factories', [])
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
                        chainRecord = Chain.getChainLength(startDate);

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
