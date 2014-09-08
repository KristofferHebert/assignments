describe('Testing for signup directive', function () {
    var element, scope, directive, compiled, html;

    beforeEach(module('app'));
    beforeEach(module('make-editable.html'));
    beforeEach(inject(function ($rootScope, $compile) {
        html = '<div make-editable>' +
            '<p>Content that will become editable when the directive rendered.</p>' +
            '</div>';

        scope = $rootScope.$new();
        compiled = $compile(html);
        element = compiled(scope);
        scope.$digest();
    }));

    it("should have the correct amount of inputs", function () {
        div = element.find('div');
        expect(div.length)
            .toBe(1);
    });

});
