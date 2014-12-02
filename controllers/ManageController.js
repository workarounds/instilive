(function () {
    var app = angular.module('Vnb');
    app.controller('ManageController', ['VnbRestangular','StateService', '$scope','$modal', function(VnbRestangular, StateService, $scope, $modal){
        var manageCtrl = this;

        var showPositions = function(data){
            console.log(data);
            manageCtrl.loading = false;
            manageCtrl.positions = data;
            if(manageCtrl.positions.length > 0) {
                manageCtrl.position = manageCtrl.positions[0];
            }
        };

        var showError = function(err){
            //Couldn't load positions
            console.log(err);
            //TODO: show some error msg
        };

        var getPositions = function() {
            manageCtrl.loggedIn = true;
            manageCtrl.loading = true;
            VnbRestangular.setJsonp(false);
            VnbRestangular.all('positions').get('manage').then(
                showPositions,showError
            );
        };

        function initialise(){
            manageCtrl.loggedIn = false;
            manageCtrl.loading = false;
            manageCtrl.positions = false;
            manageCtrl.userData = {facebook_id:''};

            StateService.getLoginStatus().then(
                getPositions,
                function(){
                    manageCtrl.loggedIn = false;
                    $(document).bind('FB_LOGGED_IN', function(){
                        getPositions();
                    });
                }
            );

            StateService.getUserData().then(
                function(data){
                    manageCtrl.userData = data;
                },
                function(err){
                    $scope.$on(
                        'userDataEvent',
                        function(event, data) {
                            manageCtrl.userData = data;
                        }
                    );
                    console.log(err);
                }
            );
        }



        manageCtrl.removeUser = function(user){

        };

        manageCtrl.addUser = function(){

        };

        manageCtrl.openPosition = function(position){
            var modalInstance = $modal.open({
                templateUrl: 'manage/position-form.html',
                controller: 'PositionFormController as posFormCtrl',
                resolve: {
                    positionData: function () {
                        if(position){
                            return position;
                        }
                        return false;
                    },
                    allCorners: function (){
                        return manageCtrl.position.all_corners;
                    }
                }
            });

            modalInstance.result.then(
                function(){
                    initialise();
                },
                function(err){
                    console.log(err);
                }
            );
        };
        manageCtrl.login = function(){
            StateService.fbLogin();
        };

        manageCtrl.changePos = function(){

        };

        initialise();
    }]);
})();
