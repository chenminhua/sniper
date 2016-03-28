appControllers.controller('SnippetDetailCtrl', ['$scope', '$routeParams', "$localStorage", "$location", 'SnippetService',
    function SnippetDetailCtrl($scope, $routeParams, $localStorage, $location, SnippetService) {
        $scope.snippet = {};
        $scope.edit = false;

        SnippetService.viewById($routeParams.snippetId).success(function (data) {
            $scope.snippet = data.snippet;
            $scope.isOwner = data.isOwner;
            $scope.isStarred = data.isStarred;
            $scope.snippet.tags = $scope.snippet.tags.join(",");
        }).error(function(err){
            alert(err.status);
            SnippetService.unlikeSnippet($routeParams.snippetId).success(function(data){
                window.history.back()
            })

        })

        $scope.deleteSnippet = function () {
            SnippetService.deleteSnippet($scope.snippet._id).success(function () {
                $location.path("/user/" + $localStorage.user.username);
            })
        };

        $scope.editSnippet = function () {
            $scope.edit = true;
        };

        $scope.cancelEdit = function () {
            $scope.edit = false;
        };

        $scope.updateSnippet = function () {
            SnippetService.updateSnippet($scope.snippet).success(function (data) {
                $scope.edit = false;
            })
        }

        $scope.likeSnippet = function(){
            SnippetService.likeSnippet($scope.snippet._id).success(function(data){
                $scope.isStarred = true;
                $scope.snippet.likes += 1;
            })
        }

        $scope.unlikeSnippet = function(){
            SnippetService.unlikeSnippet($scope.snippet._id).success(function(data){
                $scope.isStarred = false;
                $scope.snippet.likes -= 1;
            })
        }
    }]);