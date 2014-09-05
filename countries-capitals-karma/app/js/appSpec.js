describe('Testing routes', function () {
    beforeEach(module('App'));

    var location, route, rootScope;

    beforeEach(inject(
        function ($location, $route, $rootScope) {
            location = $location;
            route = $route;
            rootScope = $rootScope;
        }));

    describe('Home route', function () {
        beforeEach(inject(
            function ($httpBackend) {
                $httpBackend.expectGET('partials/home.html')
                    .respond(200);
            }));

        it('should load home template and controller', function () {
            location.path('/');
            rootScope.$digest();
            expect(route.current.controller)
                .toBe('homeCtrl');
        });
    });

    describe('Countries route', function () {
        beforeEach(inject(
            function ($httpBackend) {
                $httpBackend.expectGET('partials/countries.html')
                    .respond(200);
            }));

        it('should load countries template and controller', function () {
            location.path('/countries');
            rootScope.$digest();
            expect(route.current.controller)
                .toBe('countriesCtrl');
        });
    });

    describe('Country route', function () {
        beforeEach(inject(
            function ($httpBackend) {
                $httpBackend.expectGET('partials/country.html')
                    .respond(200);
            }));

        it('should load country template and controller', function () {
            location.path('/countries/US');
            rootScope.$digest();
            expect(route.current.controller)
                .toBe('countryCtrl');
        });
    });

    describe('Error route', function () {
        beforeEach(inject(
            function ($httpBackend) {
                $httpBackend.expectGET('partials/error.html')
                    .respond(200);
            }));

        it('should load error template', function () {
            location.path('/jfdskjhsfdjkhfdshjk');
            rootScope.$digest();
            expect(route.current.templateUrl)
                .toBe('partials/error.html');

        });
    });

});
