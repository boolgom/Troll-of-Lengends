angular.module('Troll', [])
.config(function ($interpolateProvider, $httpProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
})
.controller('IndexControl', ['$scope', '$http', function($scope, $http) {
    scope = $scope;

    $scope.init = function () {
        $scope.troll = "fuckyou";
    };

    $scope.login = function () {
        $http.post('/login/', {
            username: 'boolgom',
            password: 'boolgom'
        }).
            success(function(data, status, headers, config) {
        }).
            error(function(data, status, headers, config) {
        });
    };

    $scope.logout = function () {
        $http.post('/logout/').
            success(function(data, status, headers, config) {
        }).
            error(function(data, status, headers, config) {
        });
    };

    $scope.get_user = function () {
        $http.get('/getuser/').
            success(function(data, status, headers, config) {
            console.log(data);
        }).
            error(function(data, status, headers, config) {
            console.log(data);
        });
    };

}]);
