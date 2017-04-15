'use strict';

angular.module('MyBot')
.constant("baseURL", "https://salty-plains-47076.herokuapp.com/")
.factory('LogsFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "show/logs/1221099964674152", null, {
            'update': {
                method: 'PUT'
            }
        });

}])