
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

        var lastDay = moment($scope.logs[0].time).startOf('day');
        var firstDay = moment($scope.logs[$scope.logs.length -1].time).startOf('day')
        // lastDay.subtract(moment($scope.logs[0].time).hours(),'hours')
        // .subtract(moment($scope.logs[0].time).minute(),'minuts')
        // .subtract(moment($scope.logs[0].time).seconds(),'seconds') 
        console.log('num of days --',moment.duration(lastDay - firstDay).asDays());
        for (var i = 0; i <=  moment.duration(lastDay - firstDay).asDays() ; i++) {

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

    $scope.isSelected = function(day){
        return (day==$scope.thisDay)
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

