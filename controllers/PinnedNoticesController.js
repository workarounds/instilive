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
                var state = StateService.getState();

                if (state.tag) {
                    getPinnedNotices(state.tag);
                }
            }

            function getPinnedNotices(tag){
                VnbRestangular.all('corners')
                    .customGET('pinned', {tag: tag})
                    .then(function(data){
                        pinnedNoticesCtrl.notices = data.Notice;
                        console.log(data);
                    }, function(err){
                        console.log(err);
                    })
            }

            initialise();
        }
    ]);
})();
