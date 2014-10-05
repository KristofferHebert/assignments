describe('Testing html filer', function () {
    'use strict';

    var $filter;

    beforeEach(function () {
        module('main.filter');

        inject(function (_$filter_, _$sce_) {
            $filter = _$filter_;
            $sce = _$sce_;
        });
    });

    it('should turn string into html', function () {
        var string = '<span class="chain"></span>',
            result,
            element;

        result = $filter('main.filter')(string, 'sanitize');

        span = element.find('span');
        expect(span)
            .toEqual(1);
    });
});
