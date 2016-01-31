/**
 * Created by manidesto on 08/12/14.
 */
(function () {
    var app = angular.module('vnb.notice');

    app.directive('pinnedNotice', [function () {
        return {
            restrict: 'E',
            templateUrl: 'components/notice/pinned-notice.html',
            scope: {
                notice: "=data"
            },
            controller: 'NoticeController',
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
