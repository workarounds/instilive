(function () {
    var app = angular.module('Vnb');

    app.controller('PositionFormController', [
        'StateService',
        '$scope',
        '$modalInstance',
        'VnbRestangular',
        'positionData',
        'allCorners',
        function (StateService, $scope, $modalInstance, VnbRestangular, positionData, allCorners) {
            var posFormCtrl = this;
            var emptyPosition = {
                name: '',
                managing_corners: [],
                editing_corners: [],
                users: []
            };
            posFormCtrl.allCorners = allCorners;
            posFormCtrl.addUsersCollapsed = true;

            posFormCtrl.close = function () {
                StateService.showToast('Position saved');
                StateService.getUserData(true);
                $modalInstance.close();
            };

            posFormCtrl.showError = function () {

            };

            posFormCtrl.post = function () {
                VnbRestangular.all('positions')
                    .customPOST(posFormCtrl.position, posFormCtrl.postTo)
                    .then(posFormCtrl.close, posFormCtrl.showError);
            };
            posFormCtrl.addUser = function (user) {
                var i = posFormCtrl.position.users.indexOf(user);
                if (i === -1) {
                    posFormCtrl.position.users.push(user);
                    posFormCtrl.addUsersCollapsed = true;
                }
            };
            posFormCtrl.removeUser = function (user) {
                var i = posFormCtrl.position.users.indexOf(user);
                if (i !== -1) {
                    posFormCtrl.position.users.splice(i, 1);
                }
            };

            posFormCtrl.showAddUser = function () {
                posFormCtrl.addUsersCollapsed = false;
            };

            function initialise() {
                posFormCtrl.loading = true;
                if (positionData) {
                    posFormCtrl.modalTitle = 'Edit Position';
                    posFormCtrl.submitText = 'Edit';
                    posFormCtrl.postTo = 'edit';

                    posFormCtrl.position = emptyPosition;
                    StateService.startLoading();
                    //Request for position data
                    VnbRestangular.all('positions')
                        .customPOST({id: positionData.id}, 'view')
                        .then(function (data) {
                            StateService.stopLoading();
                            posFormCtrl.position = data;
                        }, function () {
                            StateService.stopLoading();
                            StateService.showToast('Sorry some error occurred. Please try again');
                        });

                    posFormCtrl.loading = false;
                }
                else {
                    posFormCtrl.modalTitle = 'Add Position';
                    posFormCtrl.submitText = 'Add';
                    posFormCtrl.postTo = 'add';

                    posFormCtrl.position = emptyPosition;
                    posFormCtrl.loading = false;
                }

            }

            initialise();
        }]);
})();
