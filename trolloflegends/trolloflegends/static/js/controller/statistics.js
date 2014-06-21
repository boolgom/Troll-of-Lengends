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
    $scope.sortState = '';
    $scope.url = "statistics";
    $scope.locs = [];

    $scope.sortState = "vote";

    $scope.init = function () {
        $scope.get_user();
        $scope.get_trollings();
    };

    $scope.selectVote = function () {
        $scope.sortState = "vote";
        $scope.d3Init($scope.groupedData);
    };

    $scope.selectTime = function () {
        $scope.sortState = "time";
        $scope.d3Init($scope.groupedData);
    };

    $scope.selectComment = function () {
        $scope.sortState = "comment";
        $scope.d3Init($scope.groupedData);
    };

    $scope.getBrands = function () {
        for (var i = 0; i<$scope.trolls.length; i++) {
            var name = $scope.trolls[i].location;
            var firstWord = '';
            for (var j=0;j<name.length;j++)
            {
                if (name[j]==' ')
                    break;
                else
                    firstWord = firstWord + name[j];
            }
            $scope.locs.push(firstWord);
        };
        $scope.locs = $scope.locs.filter(function(elem, pos) {
            return $scope.locs.indexOf(elem) == pos;
        });
    };

    $scope.groupBrands = function () {
        var categoryList = [];
        for (var i = 0; i<$scope.locs.length; i++) {
            var loc = $scope.locs[i];
            var locList = [];
            for (var j = 0; j<$scope.trolls.length; j++) {
                var item = $scope.trolls[j];
                if (item.location.indexOf(loc) == 0) {
                    locList.push(item);
                }
            }
            categoryList.push({
                'content': loc,
                'children': locList
            });
        }
        var root = {'name': 'troll', 'children': categoryList};
        return root;
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
            content: $scope.content,
            location: $scope.location
        }).success(function(data, status, headers, config) {
            $scope.isWriteOpen = false;
            $scope.get_trollings();
            $scope.content = '';
        }).error(function(data, status, headers, config) {
        });
    };

    $scope.get_trollings = function () {
        $http.get('/get_trollings/'
                 ).success(function(data, status, headers, config) {
                     $scope.trolls = data;
                     console.log($scope.trolls);
                     $scope.getBrands();
                     $scope.groupedData = $scope.groupBrands();
                     $scope.d3Init($scope.groupedData);
                 }).error(function(data, status, headers, config) {
                 });
    };

    $scope.closeModal = function () {
        $scope.isLoginOpen = false;
        $scope.isWriteOpen = false;
        $scope.isSigninOpen = false;
    };

    $scope.d3Init = function(root, property) {
        document.getElementById('graph').innerHTML = '';
        var margin = 20,
        diameter = 800;

        var color = d3.scale.linear()
        .domain([-1, 5])
        .range(['hsl(200,80%,80%)', 'hsl(128,30%,40%)'])
        .interpolate(d3.interpolateHcl);

        var getColor = function (depth) {
            if (depth==-1)
                //return '#a3f5cf';
                return '#fff'
                else if (depth==0)
                    return '75dccd';
                else if (depth==1)
                    return '#4dc2ca';
                else if (depth==2)
                    return '#308cb4';
                else
                    return color(depth);
        }

        var pack = d3.layout.pack()
        .padding(2)
        .size([diameter - margin, diameter - margin])
        .value(function(d) {
            if ($scope.sortState == "vote") {
                return d.num_votes + 1;
            } else if ($scope.sortState == "time") {
                return new Date(d.datetime).getHours();
            } else {
                return d.reports.length + 1;
            }
        })

        var svg = d3.select('#graph').append('svg')
        .attr('width', diameter)
        .attr('height', diameter)
        .append('g')
        .attr('transform', 'translate(' + diameter / 2 + ',' + diameter / 2 + ')');

        var focus = root,
        nodes = pack.nodes(root),
        view;

        var circle = svg.selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('class', function(d) { return d.parent ? d.children ? 'node' : 'node node--leaf' : 'node node--root'; })
        .style('fill', function(d) { return getColor(d.depth); })
        .on('click', function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

        var text = svg.selectAll('text')
        .data(nodes)
        .enter().append('text')
        .attr('class', 'label')
        .style('fill-opacity', function(d) { return d.parent === root ? 1 : 0; })
        .style('display', function(d) { return d.parent === root ? null : 'none'; })
        .text(function(d) { return d.content; });

        var node = svg.selectAll('circle,text');

        d3.select('#graph')
        .style('background', getColor(-1))
        .on('click', function() { zoom(root); });

        zoomTo([root.x, root.y, root.r * 2 + margin]);

        function zoom(d) {
            var focus0 = focus; focus = d;

            if (d.children) {
                var transition = d3.transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .tween('zoom', function(d) {
                    var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                    return function(t) { zoomTo(i(t)); };
                });
            } else {
                var transition = d3.transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .tween('zoom', function(d) {
                    var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 6 + margin]);
                    return function(t) { zoomTo(i(t)); };
                });
            }

            transition.selectAll('text')
            .filter(function(d) { return d.parent === focus || d === focus || this.style.display === 'inline'; })
            .style('fill-opacity', function(d) { return d.parent === focus || d === focus ? 1 : 0; })
            .each('start', function(d) { if (d.parent === focus) this.style.display = 'inline'; })
            $scope.$apply(function () {
                $scope.currentItem = d;
            });
        }

        function zoomTo(v) {
            var k = diameter / v[2]; view = v;
            node.attr('transform', function(d) { return 'translate(' + (d.x - v[0]) * k + ',' + (d.y - v[1]) * k + ')'; });
            circle.attr('r', function(d) { return d.r * k; });
        }
        d3.select(self.frameElement).style('height', diameter + 'px');

        $scope.currentItem = root;
    };

}]);
