var serverURL = "http://localhost:8000/";

angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function ($routeProvider, $locationProvider) {

    $routeProvider
        .when("/", { templateUrl: "/views/main.html"})
        .when("/home", { templateUrl: "/views/main.html"})
        .when("/details", { templateUrl: "/views/details.html"});

});

