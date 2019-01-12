escribe("usernameAvailable", function () {
    beforeEach(module('UsernameModule'));

    it('should query the backend when the username is checked', inject(function (usernameAvailable, $rootScope) {
        var status = false;
        usernameAvailable("johnny")
            .success(function () {
                status = true;
            });
        $rootScope.$digest();
        expect(status)
            .toBe(true);
    }));
});
