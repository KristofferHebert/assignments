describe('Testing for signup directive', function () {
    var element, scope, input;

    beforeEach(module('app'));
    beforeEach(inject(function ($rootScope, $compile) {
        element = angular.element(
            '<form action="#">' +
            '<div ng-transclude></div>' +
            '<input type="text" placeholder="First Name">' +
            '<input type="text" placeholder="Last Name">' +
            '<input type="email" placeholder="Email">' +
            '<input type="submit" vale="Submit" />' +
            '</form>');
        scope = $rootScope;
        $compile(element)(scope);
        scope.digest();
    }));

    it("should have the correct amount of inputs", function () {
        input = element.find('input');
        expect(input.length)
            .toBe(4);
    });

});
