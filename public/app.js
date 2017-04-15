'use strict';

angular.module('MyBot', ['ui.router','ngResource'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/:id',
                views: {
                    templateUrl : 'views/show.html'
                }

            })
})
