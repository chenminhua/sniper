appControllers.controller('SnippetCreateCtrl', ['$scope', '$location', '$localStorage', 'SnippetService',
    function SnippetCreateCtrl($scope, $location, $localStorage, SnippetService) {

        $scope.syntaxs = [
            {name:'c++'},
            {name:'java'},
            {name:'javascript'},
            {name:'python'}
        ];

        $scope.save = function (snippet, shouldPublish) {
            if (snippet != undefined && snippet.title != undefined && snippet.tags != undefined) {
                var content = $('#content_input').val();
                if (content != undefined) {
                    snippet.content = content;

                    snippet.syntax = snippet.syntax.name;

                    if (shouldPublish != undefined && shouldPublish == true) {
                        snippet.is_private = true;
                    } else {
                        snippet.is_private = false;
                    }
                    SnippetService.create(snippet).success(function (data) {
                        $location.path("/user/" + $localStorage.user.username);
                    }).error(function (status, data) {
                        console.log(status);
                        console.log(data);
                    });
                }
            }
        }
    }
]);
