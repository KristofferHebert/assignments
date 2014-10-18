'use strict';

angular.module('main.factories', [])
    .factory('Chain', ['$firebase', '$rootScope', 'User', 'FIREBASE_URL',

        function ($firebase, $rootScope, User, FIREBASE_URL) {

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
                    if (User.signedIn() && chainDescription) {
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
    .factory('User', ['$firebase', 'FIREBASE_URL', '$rootScope', '$firebaseSimpleLogin', function ($firebase, FIREBASE_URL, $rootScope, $firebaseSimpleLogin) {
        var ref = new Firebase(FIREBASE_URL + '/users'),
            authRef = new Firebase(FIREBASE_URL),
            auth = $firebaseSimpleLogin(authRef),
            User = {
                create: function (authUser, user) {
                    var userSchema = $firebase(ref.child(authUser.uid))
                        .$asObject(),
                        usernameString = user.username.trim(),
                        userNameList = $firebase(ref.child('username')
                            .child(usernameString));

                    userSchema.$loaded(function () {
                        var data = {
                            'id': authUser.uid
                        };
                        userNameList.$update(data);
                    });

                    return userSchema.$loaded(function () {
                        userSchema.id = authUser.uid;
                        userSchema.username = usernameString;
                        userSchema.email = user.email;
                        userSchema.goals = [];
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
                    var user = User.findByUsername(username);
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
                },
                register: function () {
                    return auth.$createUser($rootScope.user.email, $rootScope.user.password);
                },
                signedIn: function () {
                    return auth.user !== null;
                },
                login: function (user) {
                    return auth.$login('password', {
                        email: user.email,
                        password: user.password,
                        rememberMe: true
                    });
                },
                logout: function () {
                    return auth.$logout();
                },
                registerSuccess: function (authUser) {
                    $rootScope.message = 'Signing In';
                    console.log(authUser, $rootScope.user);
                    User.create(authUser, $rootScope.user);
                    return $rootScope.user;
                },
                errorHandler: function (error) {
                    console.dir(error);
                    $rootScope.message = error.code;
                },
                signUp: function (user) {
                    if (!user.password && !user.email) {
                        $rootScope.message = "Please fill out form completely";
                    }
                    User.register()
                        .then(User.registerSuccess, User.errorHandler)
                        .then(function (user) {
                            console.log('236');
                            User.login(user)
                                .then(function () {
                                    $timeout(function () {
                                        $rootScope.toggleModal('resetModal');
                                    }, 1000);
                                }, User.errorHandler);
                        });
                }



            };

        return User;
    }])
    .factory('FormValidator', ['User', function (User) {
        var FormValidator = {
            checkPassword: function (user, form) {
                form.repeatPassword.$setValidity("match", user.password == user.repeatPassword);
            },
            usernameIsAvailable: function (username, form) {
                var user = User.findByUsername(username);
                user.$loaded(function (user) {
                    form.username.$setValidity("available", user.id == null);
                });
            },
            emailRegex: /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/,
            usernameRegex: /^[a-zA-Z0-9\-_]{3,10}$/
        };

        return FormValidator;
    }]);
