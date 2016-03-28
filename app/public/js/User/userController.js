appControllers.controller('UserCtrl', ['$scope', '$localStorage','$location', '$window', 'UserService',
    function UserCtrl($scope, $localStorage, $location, $window, UserService) {
        $scope.signIn = function signIn(username, password) {
            if (username != null && password != null) {
                UserService.signin(username, password).success(function (data) {

                    $scope.$storage = $localStorage.$default({
                        token: data.token,
                        user: data.user
                    });

                    $scope.$emit("loginSuccess", true);
                    $location.path("/");
                }).error(function (status, data) {
                    console.log(status);
                    console.log(data);
                })
            }
        }

        $scope.register = function register(email, username, password, confirmedPassword) {
            if (email != null && username != null && password != null && confirmedPassword != null) {

                UserService.register(email, username, password, confirmedPassword).success(function (data) {
                    $window.sessionStorage.token = data.token;
                    $scope.$storage = $localStorage.$default({
                        token: data.token,
                        user: data.user
                    });
                    $scope.$emit("registerSuccess", true);
                    $location.path("/");
                }).error(function (status, data) {
                    console.log(status);
                    console.log(data);
                })
            }
        }


    }
])