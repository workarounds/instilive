(function () {
    var app = angular.module('Vnb');
    app.controller('MainController', [
        '$cookieStore',
        'StateService',
        function ($cookieStore, StateService) {
            var mainCtrl = this;
            // initializing toggled value from cookies
            if (angular.isDefined($cookieStore.get('toggle'))) {
                if ($cookieStore.get('toggle') == false) {
                    mainCtrl.toggle = false;
                }
                else {
                    mainCtrl.toggle = true;
                }
            };
            mainCtrl.toggleFilter = true;

            // function to toggle sidebar
            mainCtrl.toggleSidebar = function () {
                mainCtrl.toggle = !mainCtrl.toggle;

                $cookieStore.put('toggle', mainCtrl.toggle);
            };

            // function to toggle filter
            mainCtrl.toggleFilterFunction = function() {
                mainCtrl.toggleFilter = !mainCtrl.toggleFilter;
            };

            // getting the state for header
            mainCtrl.state = StateService.getState();
        }
    ]);
})();
