'use strict';

angular.module('main.directives', [])
    .directive('chainLink', ['Chain',
        function (Chain) {
            return {
                restrict: 'E',
                templateUrl: '../partials/chainLink.html',
                scope: {
                    chains: '=data'
                },
                controller: function ($scope) {
                    $scope.renderChainLinks = function (chainDate) {
                        var output = "",
                            chainStart = new Date(chainDate.start),
                            chainEnd = new Date(chainDate.end),
                            chainReason = chainDate.reason,
                            length;
                        if (!chainDate.end.length == 0) {
                            length = Chain.getChainLength(chainStart, chainEnd);
                        } else {
                            length = Chain.getChainLength(chainStart);
                            if (length == 1) {
                                output = "";
                            }
                        }
                        while (length--) {
                            output += '<span class="chain"></span>';
                        }
                        if (chainDate.end) {
                            output += '<span class="chain break"><div class="reason">' + chainReason + '</div></span>';
                        }

                        return output;

                    };
                }
            };
        }
    ])
    .directive('focus', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                $timeout(function () {
                    element[0].focus();
                }, 10);
            }
        };
    }])
    .directive('highScore', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            templateUrl: '../partials/highScore.html',
            scope: {
                record: '=data'
            },
            controller: function ($scope) {
                $scope.day = ($scope.record == 1) ? "day" : "days";
                $scope.highscore = ($scope.record < 200) ? 0 : 200;
                $scope.countup = function () {
                    $timeout(function () {
                        $scope.highscore++;
                        if ($scope.highscore < $scope.record) {
                            $scope.countup();
                        }
                    }, 10);
                };
                $scope.countup();

            }
        };
    }])
    .directive('modal', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: '../partials/modal.html',
            scope: {
                show: '=show',
                modals: '=modals'
            },
            controller: function ($scope) {
                $scope.toggleModal = function (selectedFunction, message, time) {
                    $scope.show = !$scope.show;
                    $scope[selectedFunction](message, time);
                };
            }
        };
    }])
