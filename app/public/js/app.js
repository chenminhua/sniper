'use strict'
var app = angular.module('app',['ngRoute','ngStorage','appControllers','appServices', 'appDirectives','hljs']);

var appServices = angular.module('appServices', []);

var appControllers = angular.module('appControllers', []);

var appDirectives = angular.module('appDirectives', []);

var options = {};
options.api = {};
options.api.base_url = "http://127.0.0.1:7000";


app.config(['$locationProvider','$routeProvider', function($location,$routeProvider){
    $routeProvider
    //    .when('/',{
    //    templateUrl: 'partials/snippet.list.html',
    //    controller: 'SnippetListCtrl',
    //    access: {requiredAuthentication: true}
    //})
        .when('/user/signin', {
        templateUrl: 'partials/user.signin.html',
        controller: 'UserCtrl'
    }).when('/snippet/create',{
        templateUrl: 'partials/snippet.create.html',
        controller: 'SnippetCreateCtrl',
        access: {requiredAuthentication: true}
    }).when('/user/register',{
        templateUrl: 'partials/user.register.html',
        controller: 'UserCtrl'
    }).when('/hot',{
        templateUrl: 'partials/hot.html',
        controller: 'HotSnippetCtrl'
    }).when('/snippet/:snippetId', {
        templateUrl: 'partials/snippet.detail.html',
        controller: 'SnippetDetailCtrl'
    }).when('/user/:username',{
        templateUrl: 'partials/user.info.html',
        controller: 'UserInfoCtrl'
    }).when('/about',{
         templateUrl: 'partials/about.html',
            controller: 'aboutCtrl'
        }).otherwise({
        redirectTo: '/hot'
    });
}]);

app.config(function($httpProvider){
    $httpProvider.interceptors.push('TokenInterceptor');
});

app.run(function($rootScope, $localStorage, $location) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        //redirect only if both isAuthenticated is false and no token is set
        if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication
            && !$localStorage.token) {
            $location.path("/hot");
        }
    });
});