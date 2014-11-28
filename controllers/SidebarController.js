(function() {
    var app = angular.module('Vnb');
    app.controller('SidebarController', ['StateService', function(StateService) {
        var sidebarCtrl = this;
        sidebarCtrl.currentBoardId = 1;
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
            var request = StateService.getSidebar();
            request.then(
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

        sidebarCtrl.updateCurrentBoardId = function(boardId) {
            sidebarCtrl.currentBoardId = boardId;
        };

        sidebarCtrl.login = function() {
            StateService.fbLogin().then(
                function(){
                    console.log('Yo logged in');
                },
                function(err){
                    console.log(err);
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
