(function () {
    var app = angular.module('Vnb');
    app.controller('MainController', [
        'StateService',
        '$modal',
        '$mdSidenav',
        '$scope',
        '$rootScope',
        'matchmedia',
        function (StateService, $modal, $mdSidenav, $scope, $rootScope, matchmedia) {
            var mainCtrl = this;
            mainCtrl.isDesktop = matchmedia.is('min-width: 961px');
            var unregister = matchmedia.on('(min-width: 961px)', function(mediaQueryList){
                mainCtrl.isDesktop = mediaQueryList.matches;
            }, $scope);
            var defaultHeaderColor = '(33, 33, 33)';
            mainCtrl.headerColor = defaultHeaderColor;

            mainCtrl.loading = 0;
            mainCtrl.selectedIndex = 0;

            // function to toggle sidebar
            mainCtrl.toggleLeftSidebar = function () {
                $mdSidenav('left').toggle();
            };
            mainCtrl.closeLeftSidebar = function () {
                $mdSidenav('left').close();
            };

            // function to toggle filter
            mainCtrl.toggleRightSidebar = function () {
                $mdSidenav('right').toggle();
            };

            // getting the state for header
            mainCtrl.state = StateService.getState();

            mainCtrl.login = function(){
                console.log('entered mainCtrl.login');
                StateService.fbLogin();
            };

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

            StateService.getUserData().then(
                function (data) {
                    mainCtrl.user = data;
                },
                function (err) {
                    mainCtrl.user = false;
                    console.log(err);
                }
            );

            mainCtrl.changeTab = function(index){
                mainCtrl.selectedIndex = index;
            };

            mainCtrl.reloadData = function(){
                $scope.$broadcast('VnbReloadData');
            };

            $scope.$on('userDataEvent', function (event, data) {
                mainCtrl.user = data;
            });

            $rootScope.$on('GOT_TAG_DATA', function (event, data) {
                console.log('got data');
                if(data) {
                    console.log(data);
                    if(data.header) {
                        var header = JSON.parse(data.header);
                        if(header.color) {
                            mainCtrl.headerColor = '('+header.color.r+','+header.color.g+','+header.color.b+')';
                        } else {
                            mainCtrl.headerColor = defaultHeaderColor;
                        }
                    } else {
                        mainCtrl.headerColor = defaultHeaderColor;
                    }
                }
            });

            $rootScope.$on('vnbLoading', function(event, loading){
                if(loading){
                    mainCtrl.loading++;
                }
                else{
                    mainCtrl.loading--;
                }
            });

        }
    ]);
})();
