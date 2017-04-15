'use strict';

angular.module('MyBot')
.constant("baseURL", "https://salty-plains-47076.herokuapp.com/")
.factory('LogsFactory', ['$resource','$stateParams', 'baseURL', function ($resource, $stateParams,baseURL) {
		var Id = $stateParams.id
        return $resource(baseURL + "show/logs/"+ Id, null, {
            'update': {
                method: 'PUT'
            }
        });

}])