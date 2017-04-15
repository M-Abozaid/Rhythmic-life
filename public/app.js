'use strict';

angular.module('MyBot', ['ngRoute','ui.router','ngResource'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/:id'

            })
})
