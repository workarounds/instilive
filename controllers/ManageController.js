(function () {
    var app = angular.module('Vnb');
    app.controller('ManageController', ['VnbRestangular','StateService', '$scope', function(VnbRestangular, StateService, $scope){
        VnbRestangular.setJsonp(false);
        VnbRestangular.all('positions').get('manage').then(
            console.log,console.log
        );

    }]);
})();
