(function () {
    var app = angular.module('vnb.notice', ['Vnb']);

    app.directive('notice', [function () {
        return {
            restrict: 'E',
            templateUrl: '/components/notice/notice.html',
            scope: {
                notice: "=data",
                hideUpdate: "="
            },
            controller: 'NoticeController',
            controllerAs: 'noticeCtrl'
        };
    }]);
})();
