'use strict';
alert('inside app out ')
angular.module('MyBot', ['ui.router','ngResource','n3-line-chart'])
.config(function($stateProvider, $urlRouterProvider) {
    alert('inside app config')
        $stateProvider
        	
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    
                    'content': {
                        templateUrl : 'https://salty-plains-47076.herokuapp.com/show/',
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
              alert('inside app config after')
})
console.log(' app starts');
