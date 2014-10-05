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

    angular.module('main', ['firebase', 'ngRoute', 'main.controllers', 'main.factories', 'main.directives', 'main.filters'])
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
})();


/*
  todo
  fix broken minfied code
  fix css for mobile tablet
  move bulky code away from controllers
  add chain link record length
  create unit tests
  add logic to prevent duplicate usernames
  move menu js to directive
  move modal code from portcrl to modal directive
  break up controllers, services, directives, into seperate js files
  make sure code can be minified
  tidy up controllers
  move timeout to modal flash message function
  tidy up security
  remove console.logs
  fix firebase goals array bugs

  DONE
  fix repeatPassord
  add graphic for chains
  prevent other users from breaking chains that are not their own

*/
