angular.module('myApp', ['ngAnimate'])
    .controller('myAppCtrl', myAppCtrl)
    .factory('searchInstagram', searchInstagram);

function myAppCtrl($scope, searchInstagram) {
    $scope.submitQuery = function () {
        $scope.submitted = true;
        $scope.savedQuery = $scope.query;
        console.log($scope.savedQuery);
        searchInstagram.q($scope.query).then(success, error);

        function success(data) {
            console.log(data);
            $scope.images = data.data.data;
        }

        function error(err) {
            return console.log(err);
        }

    };
}

function searchInstagram($http) {
    return {
        q: function (query) {
            var query = query.replace(/\s+/g, '_').toLowerCase();
            var url = 'https://api.instagram.com/v1/tags/' + query + '/media/recent',
                request = {
                    callback: 'JSON_CALLBACK',
                    client_id: '76aeb68df9da49a688de5bf5a2ef1739'
                };

            return $http({
                method: 'JSONP',
                url: url,
                params: request
            });
        }
    };
}