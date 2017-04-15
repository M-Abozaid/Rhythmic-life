

angular.module('MyBot')
.controller('LogsController', ['$scope', 'LogsFctory', function ($scope, LogsFctory) {

LogsFactory.query(
        function (response) {
            $scope.logs = response;
            $scope.showMenu = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });


}])
