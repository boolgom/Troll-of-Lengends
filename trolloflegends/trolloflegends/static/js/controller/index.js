angular.module('Troll', [])
.config(function ($interpolateProvider, $httpProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
})
.controller('IndexControl', ['$scope', '$http', function($scope, $http) {
    scope = $scope;

    $scope.username = '';
    $scope.password = '';

    $scope.init = function () {
        $scope.get_user();
        $scope.get_trollings();
    };

    $scope.login = function () {
        $http.post('/login/', {
            username: $scope.username,
            password: $scope.password
        }).
            success(function(data, status, headers, config) {
            $scope.user = data;
        }).
            error(function(data, status, headers, config) {
        });
    };

    $scope.logout = function () {
        $http.get('/logout/').
            success(function(data, status, headers, config) {
            $scope.user = null;
            console.log('a');
        }).
            error(function(data, status, headers, config) {
        });
    };

    $scope.get_user = function () {
        $http.get('/getuser/').
            success(function(data, status, headers, config) {
            if (data.username)
                $scope.user = data;
        }).
            error(function(data, status, headers, config) {
        });
    };

    $scope.register_user = function () {
        $http.post('/register/', {
            username: $scope.newUsername,
            password: $scope.newPassword
        }).
            success(function(data, status, headers, config) {
        }).
            error(function(data, status, headers, config) {
        });
    };

    $scope.upload = function () {
        $http.post('/write_trolling/', {
            content: $scope.content
        }).
            success(function(data, status, headers, config) {
            alert('sucksexx!!!')
        }).
            error(function(data, status, headers, config) {
        });
    };

    $scope.get_trollings = function () {
        $http.get('/get_trollings/'
        ).
            success(function(data, status, headers, config) {
            $scope.trolls = data;
        }).
            error(function(data, status, headers, config) {
        });
    };

}]);
