(function () {
    var app = angular.module('Vnb');

    app.controller('PositionFormController', ['$scope', '$modalInstance','VnbRestangular','positionData','allCorners',
        function($scope, $modalInstance, VnbRestangular, positionData, allCorners){
            var posFormCtrl = this;
            var emptyPosition = {
                name: '',
                managing_corners:[],
                editing_corners:[],
                users:[]
            };
            posFormCtrl.allCorners = allCorners;

            posFormCtrl.close = function(){
                $modalInstance.close();
            };

            posFormCtrl.showError = function(){

            };

            posFormCtrl.post = function(){
                VnbRestangular.all('positions')
                    .customPOST(posFormCtrl.position, posFormCtrl.postTo)
                    .then(posFormCtrl.close, posFormCtrl.showError);
            };

            posFormCtrl.removeUser = function(){

            };

            function initialise(){
                posFormCtrl.loading = true;
                if(positionData){
                    posFormCtrl.modalTitle = 'Edit Position';
                    posFormCtrl.submitText = 'Edit';
                    posFormCtrl.postTo = 'edit';

                    posFormCtrl.position = emptyPosition;
                    //Request for position data
                    VnbRestangular.all('positions')
                        .customPOST({id:positionData.id}, 'view')
                        .then(function(data){
                            posFormCtrl.position = data;
                        });

                    posFormCtrl.loading = false;
                }
                else{
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
