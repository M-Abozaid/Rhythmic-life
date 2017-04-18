
'use strict';

angular.module('MyBot')

.controller('LogsController', ['$scope', 'LogsFactory', function ($scope, LogsFactory) {
$scope.message = 'Loading...';
$scope.showMenu = false;

LogsFactory.query(

    function (response) {
        $scope.logs = response;
        $scope.days = [];

        
        console.log('days ',$scope.days);

        $scope.logs.sort(function(a, b){
            return b.time - a.time
        })

        for (var i = 0; i <= Math.floor( moment.duration($scope.logs[0].time - $scope.logs[$scope.logs.length -1].time).asDays()) ; i++) {
            $scope.days.push(moment($scope.logs[0].time).subtract(i, 'days').valueOf());
        }

        $scope.showMenu = true;
    },
    function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
    });

    $scope.all = true;

    $scope.setDay = function(day){
    $scope.thisDay = day;
    $scope.all = false;
    }

    $scope.allTime = function(){
        $scope.all = true;
    }

    $scope.filterFn = function(lo){
        if($scope.all){
            return true;
        }else{
        return moment($scope.thisDay).isSame(lo.time , 'day');
    }
    }
 
}])

