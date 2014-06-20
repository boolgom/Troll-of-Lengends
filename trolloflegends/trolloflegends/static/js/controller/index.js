angular.module('Troll', [])
.config(['$httpProvider', '$http'], function ($interpolateProvider, $httpProvider, $http) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
})
.controller('IndexControl', ['$scope', function($scope) {
    scope = $scope;

    $scope.init = function () {
        $scope.troll = "fuckyou";
    };

    $scope.login = function () {
        $http.post('/login', {}).
            success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
        }).
            error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };

}]);
