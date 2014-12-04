(function () {
    var app = angular.module('Vnb');

    app.factory('VnbModal', [
        '$rootScope',
        '$modal',
        '$state',
        '$window',
        function ($rootScope, $modal, $state, $window) {
            var vnbModal = this;
            vnbModal.openModal = function (modalParams) {
                if(modalParams.state) {
                    $state.go(modalParams.state, modalParams.params);
                }
                vnbModal.modalInstance = $modal.open({
                    templateUrl: modalParams.templateUrl,
                    controller: modalParams.controller,
                    size: modalParams.size,
                    resolve: modalParams.resolve
                });
                vnbModal.modalInstance.result.then(function (result) {
                    if (result) {

                    } else {
                        $window.history.back();
                    }
                    vnbModal.modalInstance = null;
                }, function () {
                    console.log('modal instance close');
                    console.log(vnbModal.modalInstance);
                    $window.history.back();
                    vnbModal.modalInstance = null;
                });
            };

            $rootScope.$on('StateChange', function (event, data) {
                if(vnbModal.modalInstance) {
                    vnbModal.modalInstance.close(true);
                }
            });

            return vnbModal;
        }
    ]);
})();
