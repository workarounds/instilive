(function () {
    var app = angular.module('Vnb');
    app.controller('SidebarController', [
        'StateService',
        '$state',
        function (StateService, $state) {
            var sidebarCtrl = this;
            sidebarCtrl.currentBoardId = 1;
            sidebarCtrl.currentBoard = {};
            var populateSidebar = function (boards) {
                sidebarCtrl.boards = boards;
                sidebarCtrl.error = false;
                sidebarCtrl.errorMsg = "success";
                initialiseSidebar();
            };

            var showError = function (err) {
                sidebarCtrl.boards = [];
                sidebarCtrl.error = true;
                sidebarCtrl.errorMsg = err;
            };

            var loadSidebar = function () {
                var request = StateService.getSidebar();
                request.then(
                    function (data) {
                        console.log(data);
                        populateSidebar(data.boards);
                    },
                    function (err) {
                        console.log(err);
                        showError(err);
                    }
                );
            };

            var initialiseSidebar = function () {
                console.log('sidebar boards');
                console.log(sidebarCtrl.boards);
                sidebarCtrl.hashData = StateService.getHashData();
                console.log(sidebarCtrl.hashData);
                var state = StateService.getState();
                if (state.tag) {
                    if (sidebarCtrl.hashData[state.tag].is_board) {
                        sidebarCtrl.currentBoard = sidebarCtrl.boards[state.tag];
                        sidebarCtrl.currentBoard.selected = true;
                    } else {
                        sidebarCtrl.currentBoard = sidebarCtrl.boards[sidebarCtrl.hashData[state.tag].board_tag];
                        sidebarCtrl.currentBoard.selected = true;
                    }
                }
            };

            sidebarCtrl.displayHierarchy = {};
            sidebarCtrl.displayHierarchy['sports'] = {
                name: 'Sports',
                prefix: 'sports',
                selected: false
            };
            sidebarCtrl.displayHierarchy['iit'] = {
                name: 'IITs',
                prefix: 'iit',
                selected: false
            };
            sidebarCtrl.displayHierarchy['day'] = {
                name: 'Days',
                prefix: 'day',
                selected: false
            };


            sidebarCtrl.removeSelectBoard = function () {
                sidebarCtrl.currentBoard.selected = false;
            };

            sidebarCtrl.updateCurrentBoardId = function (boardId) {
                sidebarCtrl.currentBoardId = boardId;
            };

            sidebarCtrl.openSelectBoard = function (board) {
                if (board == sidebarCtrl.currentBoard) {
                    if (board.selected) {
                        // board.selected = false;
                    }
                    else {
                        board.selected = true;
                    }
                }
                else {
                    sidebarCtrl.currentBoard.selected = false;
                    board.selected = true;
                }
                sidebarCtrl.currentBoard = board;
            };

            sidebarCtrl.isBoardCurrent = function (board) {
                return sidebarCtrl.currentBoard == board;
            };

            sidebarCtrl.isHomeCurrent = function () {
                return ($state.current.name == 'home') || ($state.current.name == 'home.all');
            };

            sidebarCtrl.isBoardSelected = function (board) {
                return board.selected;
            };

            sidebarCtrl.isCornerSelected = function (corner) {
                var state = StateService.getState();
                return corner.tag == state.tag;
            };


            sidebarCtrl.login = function () {
                StateService.fbLogin().then(
                    function () {
                        console.log('Yo logged in');
                    },
                    function (err) {
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
