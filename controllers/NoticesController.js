(function () {
    var app = angular.module('Vnb');

    app.controller('NoticesController', ['StateService', '$scope', function (StateService, $scope) {
        //intialize
        var noticesCtrl = this;
        var emptyUser = {
            facebook_id: 0,
            id: 0,
            name: 'anon',
            username: 'anon',
            gender: 'unknown',
            likes: []
        };
        noticesCtrl.notices = [];

        //get the data
        StateService.getData().then(
            function (data) {
                console.log(data);
                var notices = data.Notice;
                for (var i in notices) {
                    notices[i].data = JSON.parse(notices[i].data);
                }
                noticesCtrl.notices = notices;
            },
            console.log
        );

        StateService.getUserData().then(
            function (data) {
                $scope.user = data;
            },
            function (err) {
                $scope.user= emptyUser;
                console.log("failed to get user data");
                console.log(noticesCtrl.user);
                console.log(err);
            }
        );

        $scope.$on(
            'userDataEvent',
            function(event, data) {
                $scope.user = data;
            }
        );




    }]);
})();
