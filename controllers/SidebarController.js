(function() {
    var app = angular.module('Vnb');
    app.controller('SidebarController', ['NetworkService', function(NetworkService) {
        var sidebarCtrl = this;
        var populateSidebar = function(boards) {
            sidebarCtrl.boards = boards;
            sidebarCtrl.error = false;
            sidebarCtrl.errorMsg = "success";
        };

        var showError = function(err) {
            sidebarCtrl.boards = [];
            sidebarCtrl.error = true;
            sidebarCtrl.errorMsg = err;
        };

        var loadSidebar = function() {
            var request = NetworkService.getSidebar();

            request.then(
                function(response) {
                    populateSidebar(response.data.boards);
                },
                function(err) {
                    showError(err);
                }
            );
        };

        //Initilise all data bound vars
        sidebarCtrl.boards = [];
        sidebarCtrl.error = false;
        sidebarCtrl.errorMsg = "";

        loadSidebar();
    }]);
})();