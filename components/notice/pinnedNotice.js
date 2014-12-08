/**
 * Created by manidesto on 08/12/14.
 */
(function () {
    var app = angular.module('vnb.notice');

    app.directive('pinnedNotice', [function () {
        return {
            restrict: 'E',
            templateUrl: '/components/notice/pinned-notice.html',
            scope: {
                notice: "=data"
            },
            controller: 'NoticeController'
        };
    }]);
})();
