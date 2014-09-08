describe('Testing for signup directive', function () {
    var element, scope, input, compiled, html;

    beforeEach(module('app'));
    beforeEach(inject(function ($rootScope, $compile) {
        html =
            '<form action="#">' +
            '<input type="text" placeholder="First Name">' +
            '<input type="text" placeholder="Last Name">' +
            '<input type="email" placeholder="Email">' +
            '<input type="submit" vale="Submit" />' +
            '</form>';
        scope = $rootScope.$new();
        compiled = $compile(html);
        element = compiled(scope);
        scope.$digest();
    }));

    it("should have the correct amount of inputs", function () {
        input = element.find('input');
        expect(input.length)
            .toBe(4);
    });

});
