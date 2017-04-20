'use strict';

angular.module('MyBot', ['ui.router','ngResource','n3-line-chart'])
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
alert('app starts ');