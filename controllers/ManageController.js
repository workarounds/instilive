(function () {
    var app = angular.module('Vnb');
    app.controller('ManageController', ['VnbRestangular','StateService', '$scope','$modal', function(VnbRestangular, StateService, $scope, $modal){
        var manageCtrl = this;

        var showPositions = function(data){
            StateService.stopLoading();
            manageCtrl.loading = false;
            manageCtrl.positions = data;
            if(manageCtrl.positions.length > 0) {
                manageCtrl.position = manageCtrl.positions[0];
            }
            else {
                StateService.showToast('You don\'t seem to have any positions to manage');
            }
        };

        var showError = function(err){
            //Couldn't load positions
            console.log(err);
            StateService.stopLoading();
            StateService.showToast('Could load positions');
        };

        var getPositions = function() {
            manageCtrl.loggedIn = true;
            manageCtrl.loading = true;
            VnbRestangular.setJsonp(false);
            StateService.startLoading();
            VnbRestangular.all('positions').get('manage').then(
                showPositions,showError
            );
        };

        function initialise(){
            manageCtrl.loggedIn = false;
            manageCtrl.loading = false;
            manageCtrl.positions = false;
            manageCtrl.addUserCollapsed = true;
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
            var i = manageCtrl.position.users.indexOf(user);
            if(i !== -1){
                manageCtrl.position.users.splice(i, 1);
                var postData = {
                    position_id: manageCtrl.position.id,
                    user_id: user.id
                };
                StateService.startLoading();
                VnbRestangular.all('positions')
                    .customPOST(postData, 'removeUser')
                    .then(function(){
                        StateService.stopLoading();
                        StateService.showToast('User removed');
                    }, function(){
                        manageCtrl.position.users.push(user);
                        StateService.stopLoading();
                        StateService.showToast('Remove failed');
                    });
            }
        };

        manageCtrl.showAddUser = function(){
            if(!manageCtrl.addUserCollapsed){
                StateService.showToast('Please paste the users facebook profile link');
            }
            manageCtrl.addUserCollapsed = false;
        };

        manageCtrl.addUser = function(user){
            var i = manageCtrl.position.users.indexOf(user);
            if(i === -1){
                manageCtrl.position.users.push(user);
                var postData = {
                    position_id: manageCtrl.position.id,
                    user_id: user.id
                };
                StateService.startLoading();
                VnbRestangular.all('positions')
                    .customPOST(postData, 'user')
                    .then(function(){
                        StateService.stopLoading();
                        console.log('User added');
                        StateService.showToast('User added');
                    }, function(){
                        manageCtrl.position.users.pop();
                        StateService.stopLoading();
                        StateService.showToast('Adding user failed. Please try again.');
                    });
            }
            manageCtrl.addUserCollapsed = true;

        };

        manageCtrl.openPosition = function(position){
            var modalInstance = $modal.open({
                templateUrl: 'components/manage/position-form.html',
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
