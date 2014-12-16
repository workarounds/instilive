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
                        var copy = angular.element(elem.find('p.vnb-notice-copy-box'));
                        var range, selection;
                        if (window.getSelection) {
                            selection = window.getSelection();
                            range = document.createRange();
                            range.selectNodeContents(copy[0]);
                            selection.removeAllRanges();
                            selection.addRange(range);
                        } else if (document.body.createTextRange) {
                            range = document.body.createTextRange();
                            range.moveToElementText(copy[0]);
                            range.select();
                        }
                        copy[0].focus();
                        copy[0].select();
                    }, 48);
                }
            }
        };
    }]);
})();
