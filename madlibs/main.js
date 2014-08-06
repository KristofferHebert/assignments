angular.module('madLib',[])
  .controller('madlibCtrl', function ($scope) {
      $scope.submitForm = function () {
        $scope.show = 1;
      };
  });