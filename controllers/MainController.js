(function () {
    var app = angular.module('Vnb');
    app.controller('MainController', [
        'StateService',
        '$modal',
        '$mdSidenav',
        '$scope',
        '$rootScope',
        function (StateService, $modal, $mdSidenav, $scope, $rootScope) {
            var mainCtrl = this;

            mainCtrl.loading = 1;

            // function to toggle sidebar
            mainCtrl.toggleLeftSidebar = function () {
                $mdSidenav('left').toggle();
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



            $scope.$on('userDataEvent', function (event, data) {
                mainCtrl.user = data;
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
