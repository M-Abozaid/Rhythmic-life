
'use strict';

angular.module('MyBot')

.controller('LogsController', ['$scope', 'LogsFactory', function ($scope, LogsFactory) {
$scope.message = 'Loading...';
$scope.showMenu = false;

LogsFactory.query(
        function (response) {
            $scope.logs = response;
            $scope.ngative = false
            $scope.positive = false
            if($scope.logs.activity.positivity == 'ngative' ){$scope.ngative = true} 
            if($scope.logs.activity.positivity == 'positive' ){$scope.positive = true} 
            $scope.logs.sort(function(a, b){
                return b.time - a.time
            })
            
            $scope.showMenu = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

        console.log('user ')  ;
        console.log('user ') ;
        
        console.log('hslhs ');
        //this.shitty = 3234534;
        //console.log('hslhs ',shit);
}])
