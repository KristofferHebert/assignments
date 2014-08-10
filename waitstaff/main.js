angular.module('waitStaff',[])
  .controller('waitStaffCtrl', function ($scope) {
      $scope.submitForm = function () {
       if($scope.mealDetails.$valid) {
            console.log('The form is valid');
            $scope.calculate();
            $scope.resetForm();
          } else {
            console.log('The form is invalid');
          }
      };
      $scope.resetForm = function () {
       $scope.data = "";
       $scope.mealDetails.$setPristine();
      };

      $scope.calculate = function () {
          $scope.subTotal = $scope.data.base + ($scope.data.base * ($scope.data.tax *.01));
          $scope.tip= $scope.subTotal * ($scope.data.percentage *.01);
          $scope.total = $scope.subTotal + $scope.tip;

          $scope.mealCount++;
          $scope.tipTotal += $scope.tip;
          $scope.averageTip = ($scope.tipTotal / $scope.mealCount);

      };
      $scope.setDefaultValues = function () {
        $scope.mealDetails.$setPristine();
        $scope.subTotal = 0;
        $scope.tip = 0;
        $scope.total = 0;

        $scope.tipTotal = 0;
        $scope.mealCount = 0;
        $scope.averageTip = 0;
      };
  });