(function () {
    var app = angular.module('Vnb');
    app.controller('SidebarController', [
        'StateService',
        '$rootScope',
        '$state',
        function (StateService, $rootScope, $state) {
            var sidebarCtrl = this;

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
                sidebarCtrl.hashData = StateService.getHashData();
                sidebarCtrl.updateSidebarSelection();
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

            sidebarCtrl.updateSidebarSelection = function () {
                if(($state.current.name === "home.all") || ($state.current.name === "home")) {
                    sidebarCtrl.currentMenu = 'home';
                    sidebarCtrl.currentSubMenu = '';
                    return;
                } else {
                    var state = StateService.getState();
                    if (state.tag) {
                        if(state.tag.indexOf('-') > -1) {
                            var prefix = state.tag.split('-')[0];
                            if(prefix == 'interIIT') {
                                sidebarCtrl.updateCurrentMenu(state.tag);
                                return;
                            } else {
                                sidebarCtrl.currentMenu = state.tag.split('-')[0];
                                sidebarCtrl.currentSubMenu = state.tag;
                                return;
                            }
                        } else {
                            sidebarCtrl.currentMenu = 'more';
                            sidebarCtrl.currentSubMenu = state.tag;
                            return;
                        }
                    }
                }
                sidebarCtrl.currentMenu = '';
                sidebarCtrl.currentSubMenu = '';
            };

            sidebarCtrl.updateCurrentMenu = function (newMenu) {
                console.log('UpdateCurrentMenu');
                sidebarCtrl.currentMenu = newMenu;
            };

            sidebarCtrl.toggleCurrentMenu = function (menu) {
                if(sidebarCtrl.isCurrentMenu(menu)) {
                    sidebarCtrl.currentMenu = '';
                } else {
                    sidebarCtrl.updateCurrentMenu(menu);
                }
            };

            sidebarCtrl.isCurrentMenu = function(menu) {
                return sidebarCtrl.currentMenu == menu;
            };

            sidebarCtrl.updateCurrentSubMenu = function (newSubMenu) {
                console.log('updateSubMenu');
                sidebarCtrl.currentSubMenu = newSubMenu;
            };

            sidebarCtrl.isCurrentSubMenu = function(subMenu) {
                return sidebarCtrl.currentSubMenu == subMenu;
            };

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                console.log('StateChange');
                $state.current= toState;
                sidebarCtrl.updateSidebarSelection();
            });

            // Initialise all data bound vars
            sidebarCtrl.displayHierarchy = [];
            sidebarCtrl.displayHierarchy[0] = {
                name: 'Sports',
                subtitle: ' (men)',
                prefix: 'men',
                selected: false
            };
            sidebarCtrl.displayHierarchy[1] = {
                name: 'Sports',
                subtitle: ' (women)',
                prefix: 'women',
                selected: false
            };
            sidebarCtrl.displayHierarchy[2] = {
                name: 'IIT',
                subtitle:'s',
                prefix: 'iit',
                selected: false
            };
            sidebarCtrl.displayHierarchy[3] = {
                name: 'Days',
                prefix: 'day',
                selected: false
            };
            sidebarCtrl.boards = [];
            sidebarCtrl.error = false;
            sidebarCtrl.errorMsg = "";

            sidebarCtrl.currentMenu = 'home';
            sidebarCtrl.currentSubMenu = '';

            loadSidebar();
        }]);

    app.filter('removeTextInBrackets', function () {
        return function(text) {
            if(text) {
                if((text.indexOf('(')>-1)&&(text.indexOf(')')>-1)) {
                    var start = text.indexOf('(');
                    var end = text.indexOf(')');
                    return text.substring(0, start) + text.substring(end+1, text.length);
                } else {
                    return text;
                }
            } else {
                return '';
            }
        };
    });
})();
