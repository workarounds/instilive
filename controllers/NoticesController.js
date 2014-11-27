(function () {
    var app = angular.module('Vnb');

    app.controller('NoticesController', ['StateService','$scope',function (StateService, $scope) {
        //intialize
        var noticesCtrl = this;
        noticesCtrl.notices = [];

        //get the data
        StateService.getData().then(
            function(data){
                console.log(data);
                var notices = data.Notice;
                for(var i in notices){
                    notices[i].data = JSON.parse(notices[i].data);
                }
                noticesCtrl.notices = notices;
            },
            function(err){
                console.log(err);
            }
        );


    }]);
})();
