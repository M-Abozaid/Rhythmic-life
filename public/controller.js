
'use strict';

angular.module('MyBot')

.controller('LogsController', ['$scope', 'LogsFactory', function ($scope, LogsFactory) {
$scope.message = 'Loading...';
$scope.showMenu = false;

LogsFactory.query(

    function (response) {
        $scope.logs = response;
        $scope.days = [];

        for (var i = 0; i <= Math.floor(moment.duration($scope.logs[$scope.logs.length -1].time - $scope.logs[0].time).asDays()) + 1; i++) {
            $scope.days.push(moment($scope.logs[0].time).add(i, 'days'));
        }
        console.log('days ',$scope.days);

        $scope.logs.sort(function(a, b){
            return b.time - a.time
        })
        
        $scope.showMenu = true;
    },
    function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
    });

    $scope.setDay = function(day){
    $scope.thisDay = day;
    }

    $scope.filterFn = function(lo){
        return moment($scope.thisDay).isSame(lo.time , 'day');
    }
 
}])

