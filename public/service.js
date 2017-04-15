'use strict';

angular.module('MyBot')
.constant("baseURL", "https://salty-plains-47076.herokuapp.com/")
.factory('LogsFctory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "show/logs/"+cUser.recipientId, null, {
            'update': {
                method: 'PUT'
            }
        });

}])