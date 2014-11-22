(function () {
    var app = angular.module('Vnb');
    app.controller('MainController', [
        '$cookieStore',
        'StateService',
        function ($cookieStore, StateService) {

            // initializing toggled value from cookies
            if (angular.isDefined($cookieStore.get('toggle'))) {
                if ($cookieStore.get('toggle') == false) {
                    this.toggle = false;
                }
                else {
                    this.toggle = true;
                }
            };

            // function to toggle sidebar
            this.toggleSidebar = function () {
                this.toggle = !this.toggle;

                $cookieStore.put('toggle', this.toggle);
            };

            // getting the state for header
            this.state = StateService.getState();
        }
    ]);
})();
