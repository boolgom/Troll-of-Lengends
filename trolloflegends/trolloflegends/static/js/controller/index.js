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
    $scope.isLoginOpen = false;
    $scope.isWriteOpen = false;

    $scope.init = function () {
        $scope.get_user();
        $scope.get_trollings();
    };

    $scope.login = function () {
        $http.post('/login/', {
            username: $scope.username,
            password: $scope.password
        }).success(function(data, status, headers, config) {
            $scope.user = data;
            $scope.isLoginOpen = false;
        }).error(function(data, status, headers, config) {
        });
    };

    $scope.logout = function () {
        $http.get('/logout/').
            success(function(data, status, headers, config) {
            $scope.user = null;
        }).error(function(data, status, headers, config) {
        });
    };

    $scope.get_user = function () {
        $http.get('/getuser/').
            success(function(data, status, headers, config) {
            if (data.username)
                $scope.user = data;
        }).error(function(data, status, headers, config) {
        });
    };

    $scope.register_user = function () {
        $http.post('/register/', {
            username: $scope.newUsername,
            password: $scope.newPassword
        }).success(function(data, status, headers, config) {
        }).error(function(data, status, headers, config) {
        });
    };

    $scope.upload = function () {
        $http.post('/write_trolling/', {
            content: $scope.content
        }).success(function(data, status, headers, config) {
            $scope.isWriteOpen = false;
        }).error(function(data, status, headers, config) {
        });
    };

    $scope.writeReport = function (index, event) {
        if (event.keyCode != 13)
            return;
        $http.post('/write_report/', {
            content: $scope.trolls[index].newReport,
            trolling: $scope.trolls[index].id
        }).success(function(data, status, headers, config) {
            $scope.isWriteOpen = false;
            $scope.get_trollings();
        }).error(function(data, status, headers, config) {
        });
    };

    $scope.get_trollings = function () {
        $http.get('/get_trollings/'
        ).success(function(data, status, headers, config) {
            $scope.trolls = data;
        }).error(function(data, status, headers, config) {
        });
    };

    $scope.closeModal = function () {
        $scope.isLoginOpen = false;
        $scope.isWriteOpen = false;
        $scope.isSigninOpen = false;
    };

}]);
