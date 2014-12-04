(function () {
    var app = angular.module('Vnb');

    app.controller('NoticesController', ['StateService', '$scope', function (StateService, $scope) {
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
    }]);
})();
