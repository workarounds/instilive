(function() {
    var app = angular.module('vnb.notice', []);

    app.directive('notice', [function() {
        return {
            restrict: 'E',
            templateUrl: '/components/notice/notice.html',
            scope:{
                notice: "=data"
            }
        };
    }]);
})();