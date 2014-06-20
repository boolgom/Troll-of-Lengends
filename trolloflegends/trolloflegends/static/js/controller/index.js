angular.module('Troll', []).config( function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
})
.controller('IndexControl', ['$scope', function($scope) {
    $scope.init = function () {
        $scope.troll = "fuckyou";
    };
}]);
