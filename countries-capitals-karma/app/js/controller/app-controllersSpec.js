describe('App.controllers: homeCtrl', function () {
    beforeEach(module('App.controllers'));
    describe('homeCtrl', function () {
        var ctrl, scope;
        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            ctrl = $controller('homeCtrl', {
                $scope: scope
            });
        }));

        it('Home button should be hidden, and browse button should be visible', inject(function ($rootScope) {
            expect($rootScope.button)
                .toEqual({
                    home: false,
                    browse: true
                });
        }));
    });
});


describe('App.controllers: countriesCtrl', function () {
    beforeEach(module('App.controllers'));
    describe('countriesCtrl', function () {
        var ctrl, scope;
        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            ctrl = $controller('countriesCtrl', {
                $scope: scope
            });
        }));

        it('Browse button should be hidden, and home button should be visible', inject(function ($rootScope) {
            expect($rootScope.button)
                .toEqual({
                    home: true,
                    browse: false
                });
        }));
    });
});
