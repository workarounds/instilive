/**
 * Created by manidesto on 03/12/14.
 */
(function () {
    var app = angular.module('vnb.directives');

    app.directive('vnbAddUser', function(){
        return {
            controller:['$scope', 'VnbRestangular', '$http', function($scope, VnbRestangular, $http){
                $scope.message = "";
                $scope.profileLink = "";
                $scope.user = false;
                var userData = false;

                var sendGraphData = function(data){
                    VnbRestangular.all('users')
                        .customPOST(data, 'graph')
                        .then(function(data){
                            $scope.message = "";
                            $scope.callback({user: data});
                        }, function(){
                            $scope.message = "Some error occured. Please try again";
                        });
                };

                var showUser = function(data){
                    $scope.user = {
                        facebook_id: data.id,
                        name: data.name
                    };
                };

                $scope.add = function(){
                    if(userData){
                        $scope.message="Adding user to database";
                        sendGraphData(userData);
                    }
                    else{
                        $scope.message = "Not valid user";
                    }
                };

                $scope.check = function(){
                    $scope.message="getting user";
                    if($scope.profileLink != '') {
                        $http.get('http://graph.facebook.com/' + $scope.profileLink)
                            .then(function (response) {
                                userData = response.data;
                                if (userData.id) {
                                    showUser(userData);
                                    $scope.message = "";
                                }
                                else {
                                    $scope.message = "Invalid link";
                                }
                            }, function () {
                                $scope.message = "Unable to connect to facebook";
                            });
                    }
                };


            }],
            scope:{
                callback:'&'
            },
            restrict: 'E',
            templateUrl: 'components/vnbAddUser/vnb-add-user.html'
        }
    });
})();
