angular.module('madLib',['ngAnimate'])
  .controller('madlibCtrl', function ($scope) {
      $scope.submitForm = function () {
       if($scope.myForm.$valid) {
            console.log('The form is valid');
          } else {
            console.log('The form is invalid');
          }
       $scope.submitted = true;
      };
      $scope.resetForm = function () {
       $scope.data = "";
       $scope.myForm.$setPristine();
       $scope.submitted = false;
      };
  });