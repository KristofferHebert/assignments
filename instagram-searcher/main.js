angular.module('myApp',['ngAnimate'])
  .controller('myAppCtrl', myAppCtrl)
  .factory('searchInstagram', searchInstagram);

function myAppCtrl($scope, searchInstagram){
  $scope.submitQuery = function(){
    searchInstagram.q($scope.query)
      .then(function(data){
          $scope.images = data.data.data;
          window.images = $scope.images;
      });
  };
}

function searchInstagram($http){
  return {
    q : function(query){
      query.replace(/\s+/g, '-').toLowerCase();
      var url = 'https://api.instagram.com/v1/tags/' + query +'/media/recent',
          request = {
            callback: 'JSON_CALLBACK',
            client_id: '76aeb68df9da49a688de5bf5a2ef1739'
          };

      return $http({
            method: 'JSONP',
            url: url,
            params: request
      })
      .success(function(result) {
           return result;
       })
      .error(function(error) {
           return console.log(error)
       })
    }
  }
}