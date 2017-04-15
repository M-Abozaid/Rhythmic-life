

angular.module('MyBot')
.controller('LogsController', ['$scope', 'menuFactory', 'favoriteFactory', function ($scope, menuFactory, favoriteFactory) {

LogsFactory.query(
        function (response) {
            $scope.logs = response;
            $scope.showMenu = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });


}])
