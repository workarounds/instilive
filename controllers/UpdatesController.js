(function () {
    var app = angular.module('Vnb');
    app.controller('UpdatesController', [
        '$scope',
        'VnbRestangular',
        'StateService',
        'notice',
        function ($scope, VnbRestangular, StateService, notice) {
            var updatesCtrl = this;
            updatesCtrl.getUpdatesFromChildId = function () {
                console.log('getting updates from child id: ');
                console.log(updatesCtrl.notice.id);
                VnbRestangular.setJsonp(true);
                VnbRestangular.all('notices')
                    .get('childUpdates', {id: updatesCtrl.notice.id})
                    .then(
                    function (data) {
                        updatesCtrl.updates = data;
                        updatesCtrl.getCurrentNotice();
                        console.log('returned data: ');
                        console.log(data);
                    },
                    function (err) {
                        console.log(err);
                    }
                );
                VnbRestangular.setJsonp(false);
            };

            updatesCtrl.getCurrentNotice = function() {
                console.log(updatesCtrl.updates);
                for (var i in updatesCtrl.updates) {
                    console.log('notice id: ');
                    console.log(updatesCtrl.notice.id);
                    if(updatesCtrl.notice.id == updatesCtrl.updates[i].id) {
                        updatesCtrl.notice = updatesCtrl.updates[i];
                        break;
                    }
                }
            };

            updatesCtrl.getUpdates = function () {
                VnbRestangular.setJsonp(true);
                VnbRestangular.all('notices')
                    .get('updates', {id: updatesCtrl.parent})
                    .then(
                    function (data) {
                        updatesCtrl.updates = data;
                    },
                    function (err) {
                        console.log(err);
                    }
                );
                VnbRestangular.setJsonp(false);
            };


            if(notice) {
                console.log('got notice');
                console.log(notice);
                updatesCtrl.notice = notice;
                if(updatesCtrl.notice.parent) {
                    updatesCtrl.parent = updatesCtrl.notice.parent;
                } else {
                    updatesCtrl.parent = updatesCtrl.notice.id;
                }
                updatesCtrl.getUpdates();
            } else {
                console.log('No notice');
                var curState = StateService.getState();
                updatesCtrl.notice = {
                    id: curState.notice
                };
                updatesCtrl.getUpdatesFromChildId();
            }


            updatesCtrl.isCurrentNotice = function (tempNotice) {
                return tempNotice.id == updatesCtrl.notice.id;
            };
        }
    ]);
})();
