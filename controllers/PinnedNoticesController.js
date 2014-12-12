/**
 * Created by manidesto on 08/12/14.
 */
(function () {
    var app = angular.module('Vnb');

    app.controller('PinnedNoticesController', [
        'StateService',
        'VnbRestangular',
        function(StateService, VnbRestangular){
            var pinnedNoticesCtrl = this;
            function initialise() {
                pinnedNoticesCtrl.notices = [];
                pinnedNoticesCtrl.visibleNotices = [];
                pinnedNoticesCtrl.canExpand = false;
                pinnedNoticesCtrl.canCompress = false;
                var state = StateService.getState();

                if (state.tag) {
                    getPinnedNotices(state.tag);
                }
            }

            function getPinnedNotices(tag){
                VnbRestangular.setJsonp(true);
                VnbRestangular.all('corners')
                    .customGET('pinned', {tag: tag})
                    .then(function(data){
                        pinnedNoticesCtrl.notices = data.Notice;
                        pinnedNoticesCtrl.compress();
                    }, function(err){
                        console.log(err);
                    });
                VnbRestangular.setJsonp(false);
            }

            pinnedNoticesCtrl.compress = function(){
                pinnedNoticesCtrl.visibleNotices = [];
                if(pinnedNoticesCtrl.notices.length>0){
                    pinnedNoticesCtrl.visibleNotices.push(
                        pinnedNoticesCtrl.notices[0]
                    );
                }
                if(pinnedNoticesCtrl.notices.length>1){
                    pinnedNoticesCtrl.canExpand = true;
                }
                pinnedNoticesCtrl.canCompress = false;
            };

            pinnedNoticesCtrl.expand = function(){
                pinnedNoticesCtrl.visibleNotices = pinnedNoticesCtrl.notices;
                pinnedNoticesCtrl.canExpand = false;
                if(pinnedNoticesCtrl.notices.length>1){
                    pinnedNoticesCtrl.canCompress = true;
                }
            };

            initialise();
        }
    ]);
})();
