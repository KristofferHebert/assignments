describe('Testing Profile page', function () {
    beforeEach(function () {
        browser.get('http://staychain.com/#/kristoffer');
    });

    it('It should say the username greeting', function () {

        var username = $('h3');
        expect(username.getText())
            .toBe('Hello kristoffer');
    });

    it('Break chain button should not show if user is not owner', function () {
        expect(element(by.buttonText('Break chain'))
                .isPresent())
            .toBe(false);

    });

});
