appControllers.controller('SnippetListCtrl', ['$scope', '$sce', 'SnippetService',
    function SnippetListCtrl($scope, $sce, SnippetService) {
        $scope.snippets = [];
        SnippetService.findAll().success(function (data) {
            $scope.snippets = data;
        });

        $scope.deleteSnippet = function(snippetId){
            SnippetService.deleteSnippet(snippetId).success(function(data){
                $scope.snippets = _.filter($scope.snippets, function(snippet){
                    return snippet.id != snippetId
                })
            })
        }
    }]);