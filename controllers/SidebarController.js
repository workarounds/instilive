(function() {
    var app = angular.module('Vnb');
    app.controller('SidebarController', ['StateService', function(StateService) {
        var sidebarCtrl = this;
        sidebarCtrl.currentBoardId = 1;
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

        sidebarCtrl.toggleSelectBoard = function(board){
            if(board == sidebarCtrl.currentBoard) {
                if (board.selected) {
                    board.selected = false;
                }
                else {
                    board.selected = true;
                }
            }
            else{
                sidebarCtrl.currentBoard.selected = false;
                board.selected = true;
            }
            sidebarCtrl.currentBoard = board;
        };

        sidebarCtrl.isBoardCurrent = function(board){
            var state = StateService.getState();
            return board.tag == state.tag;
        };

        sidebarCtrl.isBoardSelected = function(board){
            return board.selected;
        }

        sidebarCtrl.isCornerSelected = function(corner){
            var state = StateService.getState();
            return corner.tag == state.tag;
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
