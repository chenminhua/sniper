appServices.factory('SnippetService', function($http,$localStorage){
    return {
        findAll: function(username){
            if($localStorage.user) {
                return $http.get(options.api.base_url + '/user/' + username + '/snippet', {headers: {UserId: $localStorage.user._id}});
            }else{
                return $http.get(options.api.base_url + '/user/' + username + '/snippet');
            }
        },
        findHot: function(){
            return $http.get(options.api.base_url + '/snippet/hot');
        },
        create: function(snippet){
            console.log(snippet)
            return $http.post(options.api.base_url + '/snippet', {snippet: snippet});
        },
        viewById: function(snippetId){
            if($localStorage.user){
                return $http.get(options.api.base_url + '/snippet/id/' + snippetId, {headers:{UserId: $localStorage.user._id}});
            }else{
                return $http.get(options.api.base_url + '/snippet/id/' + snippetId)
            }
        },
        deleteSnippet: function(snippetId){
            return $http.delete(options.api.base_url + '/snippet/' + snippetId);
        },
        updateSnippet: function(snippet){
            return $http.put(options.api.base_url + '/snippet', {snippet:
            {title: snippet.title, description: snippet.description, tags: snippet.tags, syntax: snippet.syntax, content:snippet.content, snippetId:snippet._id}})
        },
        likeSnippet: function(snippetId){
            return $http.put(options.api.base_url + '/user/likes/' + snippetId)
        },
        unlikeSnippet: function(snippetId){
            return $http.delete(options.api.base_url + '/user/likes/' + snippetId)
        }

    }
});

appServices.factory('TokenInterceptor', function ($q, $localStorage, $window, $location) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if($localStorage.token){
                config.headers.Authorization = 'Bearer ' + $localStorage.token;
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        }

    };
});

appServices.factory('UserService', function($http, $localStorage){
    return {
        signin: function(username, password){
            return $http.post(options.api.base_url + '/user/signin', {username:username, password:password})
        },
        logout: function(){
            return $http.get(options.api.base_url + '/user/logout');
        },
        register: function(email, username, password, passwordConfirmed){
            return $http.post(options.api.base_url + '/user/register', {email: email, username:username, password:password, passwordConfirmed:passwordConfirmed});
        },
        getUser: function(username){
            if($localStorage.user) {
                return $http.get(options.api.base_url + '/user/' + username, {headers: {UserId: $localStorage.user._id}});
            }else{
                return $http.get(options.api.base_url + '/user/' + username);
            }
        },
        follow: function(username){
            return $http.put(options.api.base_url + '/user/following/' + username);
        },
        unfollow: function(username){
            return $http.delete(options.api.base_url + '/user/following/' + username);
        },
        getfollowers: function(username){
            return $http.get(options.api.base_url + '/user/'+ username + '/followers')
        },
        getfollowing: function(username){
            return $http.get(options.api.base_url + '/user/'+ username + '/following')
        },
        getlikes: function(username){
            return $http.get(options.api.base_url + '/user/' + username + '/likes')
        }
    }
});