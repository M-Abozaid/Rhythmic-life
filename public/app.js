'use strict';

angular.module('MyBot', ['n3-line-chart','ui.router','ngResource'])
.config(function($stateProvider, $urlRouterProvider) {
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
})
console.log(' app starts');