
'use strict';

angular.module('MyBot')

.controller('LogsController', ['$scope', 'LogsFactory', function ($scope, LogsFactory) {
$scope.message = 'Loading...';
$scope.showMenu = false;

LogsFactory.query(

    function (response) {
        $scope.logs = response;
        let days = [];

        for (var i = 0; i <= moment.duration($scope.logs[$scope.logs.length -1].time - $scope.logs[0].time).days() - 1; i++) {
            days.push(moment($scope.logs[0].time).add(i, 'days'));
        }

        $scope.logs.sort(function(a, b){
            return b.time - a.time
        })
        
        $scope.showMenu = true;
    },
    function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
    });

 
}])

$scope.setDay = function(day){
let thisDay = day;
}

$scope.filterFn = function(lo){
    return moment(thisDay).isSame(lo.time , 'day');
}