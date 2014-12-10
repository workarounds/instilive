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
            controllerAs: 'noticeCtrl',
            link: function(scope, elem, attrs){
                scope.copyLink = function() {
                    scope.showCopyBox = true;
                    setTimeout(function(){
                        var copy = angular.element(elem.find('input'));
                        copy[0].focus();
                        copy[0].select();
                    }, 48);
                }
            }
        };
    }]);
})();
