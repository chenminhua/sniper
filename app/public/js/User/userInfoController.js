appControllers.controller("UserInfoCtrl", ["$scope","$routeParams","$localStorage","UserService","SnippetService",
    function UserInfoCtrl($scope, $routeParams, $localStorage, UserService,SnippetService){
        $scope.info = "snippet";
        if($localStorage.user && $localStorage.user.username == $routeParams.username){
            $scope.isyourself = true;
        }

        UserService.getUser($routeParams.username).success(function(data){
            $scope.user = data.user;
            $scope.isfollowed = data.isfollowed;
            console.log($scope.user.likes)
        });

        $scope.unfollow = function(){
            UserService.unfollow($scope.user.username).success(function(data){
                $scope.isfollowed = false;
                $scope.user.followers_count -= 1;
            })
        };

        $scope.follow = function(){
            UserService.follow($scope.user.username).success(function(data){
                $scope.isfollowed = true;
                $scope.user.followers_count += 1;
            })
        }

        $scope.snippets = [];
        SnippetService.findAll($routeParams.username).success(function (data) {
            $scope.snippets = data;
        });

        $scope.deleteSnippet = function(snippetId){
            SnippetService.deleteSnippet(snippetId).success(function(data){
                $scope.user.snippets_count -= 1;
                $scope.snippets = _.filter($scope.snippets, function(snippet){
                    return snippet._id != snippetId
                })
            })
        };

        $scope.changeInfo = function(category){
            $scope.info = category;
            //此处应当有单例
            if(category=="follower" && !$scope.followers ){
                UserService.getfollowers($scope.user.username).success(function(data){
                    $scope.followers = data.followers
                })
            }

            if(category=="following" && !$scope.following){
                UserService.getfollowing($scope.user.username).success(function(data){
                    $scope.following = data.following
                })
            }

            //if(category=="likes" && !$scope.likes){
            //    UserService.getlikes($scope.user.username).success(function(data){
            //        $scope.likes = data.likes
            //    })
            //}
        }
}]);