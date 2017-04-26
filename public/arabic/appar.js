'use strict';
console.log('inside app out ')
angular.module('MyBot', ['ui.router','ngResource'])
.config(function($stateProvider, $urlRouterProvider) {
    console.log('inside app config')
        $stateProvider
        	
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    
                    'content': {
                        templateUrl : 'https://salty-plains-47076.herokuapp.com/show/ar/',
                        controller  : 'LogsController'
                    }
                }

            })
        
            .state('app.statistics', {
                url:'statistics',
                views: {
                    'content@': {
                        templateUrl : 'https://salty-plains-47076.herokuapp.com/statistics.html',
                        controller  : 'StatisticsController'                  
                    }
                }
            })

              $urlRouterProvider.otherwise('/');
              console.log('inside app config after')
})
console.log(' app starts');


