(function () {
    var app = angular.module('Vnb');

    app.controller('NoticesController', [
        'StateService',
        '$state',
        '$scope',
        function (StateService, $state, $scope) {
            //intialize
            var noticesCtrl = this;
            noticesCtrl.notices = [];
            noticesCtrl.dataLoaded = false;
            noticesCtrl.limitTo = 10;

            // check for redirect
            var currentState = StateService.getState();
            if(currentState.notice) {
                $state.go('home.direct', {notice: currentState.notice});
            }

            function fillData(data){
                console.log(data);
                var notices = data.Notice;
                noticesCtrl.notices = notices;
                noticesCtrl.dataLoaded = true;
                setTimeout(function(){
                    noticesCtrl.limitTo = 20
                }, 500);
            }

            function loadingFailded(){
                console.log();
                StateService.showToast('Network error. Please check your connection');
                noticesCtrl.dataLoaded = true;
            }


            //get the data
            StateService.getData().then(
                function (data) {
                    fillData(data)
                },
                function() {
                    loadingFailded();
                }
            );

            noticesCtrl.loadMore = function () {
                var lastIndex = noticesCtrl.notices.length - 1;
                var from = noticesCtrl.notices[lastIndex].modified;
                var options = {from: from};
                StateService.getData(false, options, true).then(
                    function (data) {
                        var extraNotices = data.Notice;
                        console.log(extraNotices);
                        noticesCtrl.notices = noticesCtrl.notices.concat(extraNotices);
                        console.log(noticesCtrl.notices);
                    },
                    console.log
                );
            };

            $scope.$on('VnbReloadData', function(){
                noticesCtrl.dataLoaded = false;
                StateService.getData(false, false, true).then(
                    function(data){
                        fillData(data)
                    },
                    function(){
                        loadingFailded();
                    }
                )
            });
        }]);
})();
