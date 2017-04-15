'use strict';

angular.module('MyBot')
.constant("baseURL", "https://salty-plains-47076.herokuapp.com/")
.factory('LogsFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "show/logs/:id",{id:"@Id"} null, {
            'update': {
                method: 'PUT'
            }
        });

}])