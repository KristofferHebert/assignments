angular.module('app', [])
    .directive('makeEditable', [

        function () {
            return {
                restrict: 'A',
                templateUrl: 'make-editable.html',
                transclude: true,
                scope: true,
                link: function (scope, element, attrs) {
                    scope.editable = false;
                    scope.state = 'edit';
                    scope.edit = function () {
                        scope.editable = true;
                        scope.state = 'save';
                    };
                    scope.save = function () {
                        scope.editable = false;
                        scope.state = 'edit';
                    };
                    scope.toggle = function () {
                        scope.state == 'edit' ? scope.edit() : scope.save();
                    };


                }
            };
        }
    ])
