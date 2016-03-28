appControllers.controller('HotSnippetCtrl', ['$scope', 'SnippetService',
    function HotSnippetCtrl($scope, SnippetService) {
        $scope.snippets = [];
        SnippetService.findHot().success(function (data) {
            $scope.snippets = data;
        })
    }])

