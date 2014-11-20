(function() {
    var app = angular.module('Vnb');
    app.controller('SidebarController', ['VnbRestangular', function(VnbRestangular) {
        var sidebarCtrl = this;
        var populateSidebar = function(boards) {
            for (var bTag in boards) {
                boards[bTag].tag = bTag + "/all";
                for(var cTag in boards[bTag].corners){
                    boards[bTag].corners[cTag].tag = bTag + "/" + cTag;
                }
            }
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
            VnbRestangular.all('boards').customGET('sidebar').then(
                function(data) {
                    console.log(data);
                    populateSidebar(data.boards);
                },
                function(err) {
                    console.log(err);
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
