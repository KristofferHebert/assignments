angular.module('app', [])
    .directive('optIn', [

        function () {
            return {
                restrict: 'E',
                transclude: true,
                templateUrl: 'opt-in.html',
                replace: true
            };
        }
    ])
