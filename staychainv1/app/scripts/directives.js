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
                            output += '<span class="chain"></span>';
                        }
                        if (chainDate.end) {
                            output += '<span class="chain break"></span>';
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
    }]);
