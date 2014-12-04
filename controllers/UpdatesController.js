(function () {
    var app = angular.module('Vnb');
    app.controller('UpdatesController', [
        '$scope',
        'VnbRestangular',
        'notice',
        function ($scope, VnbRestangular, notice) {
            var updatesCtrl = this;
            updatesCtrl.notice = notice;
            if(updatesCtrl.notice.parent) {
                updatesCtrl.parent = updatesCtrl.notice.parent;
            } else {
                updatesCtrl.parent = updatesCtrl.notice.id;
            }
            updatesCtrl.isCurrentNotice = function (tempNotice) {
                return tempNotice.id == updatesCtrl.notice.id;
            };
            var getUpdates = function () {
                VnbRestangular.setJsonp(true);
                VnbRestangular.all('notices')
                    .get('updates', {id: updatesCtrl.parent})
                    .then(
                    function (data) {
                        updatesCtrl.updates = data;
                        console.log('update data: ');
                        console.log(data);
                    },
                    function (err) {
                        console.log("error....");
                        console.log(err);
                    }
                );
                VnbRestangular.setJsonp(false);
            };
            getUpdates();
        }
    ]);
})();
