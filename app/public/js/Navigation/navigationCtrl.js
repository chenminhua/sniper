appControllers.controller('NavigationCtrl', function ($scope, $window, $localStorage, $location, UserService) {
    $scope.login = $localStorage.token;
    $scope.user = $localStorage.user || '';
    $scope.$on("loginSuccess", function () {
        $scope.login =  $localStorage.token;
        $scope.user = $localStorage.user;
    });

    $scope.$on("registerSuccess", function () {
        $scope.login =  $localStorage.token;
        $scope.user = $localStorage.user;


    });

    $scope.logOut = function logOut() {
        if ($localStorage.token) {

            UserService.logout().success(function (data) {

                delete $localStorage.token;
                delete $localStorage.user;
                $scope.login = false;
                $location.path('/hot');
            }).error(function (status, data) {
                console.log(status);
                console.log(data);
            });
        }
    }
});

