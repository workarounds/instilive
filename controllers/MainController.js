(function () {
    var app = angular.module('Vnb');
    app.controller('MainController', [
        '$cookieStore',
        'StateService',
        '$modal',
        '$mdSidenav',
        function ($cookieStore, StateService, $modal, $mdSidenav) {
            var mainCtrl = this;

            // function to toggle sidebar
            mainCtrl.toggleLeftSidebar = function () {
                $mdSidenav('left').toggle();
            };

            // function to toggle filter
            mainCtrl.toggleRightSidebar = function () {
                $mdSidenav('right').toggle();
            };

            // getting the state for header
            mainCtrl.state = StateService.getState();

            // opening create event modal
            mainCtrl.openEventModal = function () {

                var modalInstance = $modal.open({
                    templateUrl: 'components/notice/create-event.html',
                    controller: 'CreateEventController as createEventCtrl',
                    size: 'lg',
                    resolve: {
                        noticeData: false
                    }
                });

                modalInstance.result.then(function () {
                    console.log('something happened');
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            };
        }
    ]);
})();
