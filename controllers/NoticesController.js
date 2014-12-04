(function () {
    var app = angular.module('Vnb');

    app.controller('NoticesController', ['StateService', function (StateService) {
        //intialize
        var noticesCtrl = this;
        noticesCtrl.notices = [];

        //get the data
        StateService.getData().then(
            function (data) {
                var notices = data.Notice;
                noticesCtrl.notices = notices;
            },
            console.log
        );

        noticesCtrl.loadMore = function(){
            var lastIndex = noticesCtrl.notices.length -1;
            var from = noticesCtrl.notices[lastIndex].modified;
            var options = {from:from};
            StateService.getData(false, options).then(
                function(data){
                    var extraNotices = data.Notice;
                    console.log(extraNotices);
                    noticesCtrl.notices = noticesCtrl.notices.concat(extraNotices);
                    console.log(noticesCtrl.notices);
                },
                console.log
            );
        };
    }]);
})();
