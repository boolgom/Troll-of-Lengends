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
    $scope.sortState = 'vote';
    $scope.url = 'main';

    $scope.init = function () {
        $scope.get_user();
        $scope.get_trollings();
    };

    $scope.getMaxVote = function () {
        var max = 0;
        for (var i in $scope.trolls) {
            var a = $scope.trolls[i].num_votes;
            if (a>max)
                max = a;
        }
        return max;
    };

    $scope.getMaxTime = function () {
        if ($scope.trolls)
        return $scope.trolls.length;
    };

    $scope.getMaxReport = function () {
        var max = 0;
        for (var i in $scope.trolls) {
            var a = $scope.trolls[i].reports.length;
            if (a>max)
                max = a;
        }
        return max;
    };

    $scope.login = function () {
        $http.post('/login/', {
            username: $scope.username,
            password: $scope.password
        }).success(function(data, status, headers, config) {
            $scope.user = data;
            $scope.isLoginOpen = false;
            $scope.get_trollings();
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
            $scope.isSigninOpen = false;
            $scope.get_user();
        }).error(function(data, status, headers, config) {
        });
    };

    $scope.upload = function () {
        $http.post('/write_trolling/', {
            content: $scope.content,
            location: $scope.location
        }).success(function(data, status, headers, config) {
            $scope.isWriteOpen = false;
            $scope.get_trollings();
            $scope.content = '';
        }).error(function(data, status, headers, config) {
        });
    };

    $scope.doVote = function (troll) {
        $http.post('/vote_trolling/', {
            trolling: troll.id
        }).success(function(data, status, headers, config) {
            if (troll.isVote) {
                troll.num_votes -= 1;
                troll.isVote = '';
            } else {
                troll.num_votes += 1;
                troll.isVote = 'true';

            }
        }).error(function(data, status, headers, config) {
        });
    };

    $scope.writeReport = function (troll, event) {
        if (event.keyCode != 13 || !troll.newReport)
            return;
        $http.post('/write_report/', {
            content: troll.newReport,
            trolling: troll.id
        }).success(function(data, status, headers, config) {
            troll.reports.push({
                username: $scope.user.username,
                content: troll.newReport,
                datetime: new Date()
            });
            troll.newReport = '';
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

    $scope.sortFunc = function (troll) {
        var sortState = $scope.sortState;
        if (sortState == "vote") {
            return -troll.num_votes;
        } else if (sortState == "time") {
            return -(new Date(troll.datetime).getTime());
        } else {
            return -troll.reports.length;
        }
    };

}]);
