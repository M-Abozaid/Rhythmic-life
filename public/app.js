'use strict';

angular.module('MyBot', ['n3-line-chart','ui.router','ngResource'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    
                    'content': {
                        templateUrl : 'https://salty-plains-47076.herokuapp.com/show/show.html',
                        controller  : 'LogController'
                    }
                }

            })
        
            // // route for the aboutus page
            // .state('app.aboutus', {
            //     url:'aboutus',
            //     views: {
            //         'content@': {
            //             templateUrl : 'views/aboutus.html',
            //             controller  : 'AboutController'                  
            //         }
            //     }
            // })

})