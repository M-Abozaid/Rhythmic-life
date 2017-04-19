'use strict';

angular.module('MyBot')
.constant("baseURL", "https://salty-plains-47076.herokuapp.com/")
.factory('LogsFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
		
		let parts = document.URL.split('/')
		console.log('parts ', parts);
		let Id = parts[4]
        
        return $resource(baseURL + "show/logs/"+ Id, null, {
            'update': {
                method: 'PUT'
            }
        });

}])

