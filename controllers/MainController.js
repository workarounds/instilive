(function () {
    var app = angular.module('Vnb');
    app.controller('MainController', [
        '$cookieStore',
        'StateService',
        '$modal',
        function ($cookieStore, StateService, $modal) {
            var mainCtrl = this;
            // initializing toggled value from cookies
            if (angular.isDefined($cookieStore.get('toggle'))) {
                if ($cookieStore.get('toggle') === false) {
                    mainCtrl.toggle = false;
                }
                else {
                    mainCtrl.toggle = true;
                }
            }
            mainCtrl.toggleFilter = true;

            // function to toggle sidebar
            mainCtrl.toggleSidebar = function () {
                mainCtrl.toggle = !mainCtrl.toggle;

                $cookieStore.put('toggle', mainCtrl.toggle);
            };

            // function to toggle filter
            mainCtrl.toggleFilterFunction = function () {
                mainCtrl.toggleFilter = !mainCtrl.toggleFilter;
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
