(function () {
    var app = angular.module('vnb.link', []);

    app.directive('vnbLink', [
        'StateService',
        '$state',
        '$rootScope',
        function (StateService, $state, $rootScope) {
            var hashData = false;
            $rootScope.$on('VNB_HASH_DATA', function () {
                hashData = StateService.getHashData();
            });
            var go = function (tag) {
                if (hashData) {
                    if (hashData[tag]) {
                        $state.go('tag.all', {tag: tag});
                    }
                    else {
                        console.log('No data found');
                    }
                }
                else {
                    console.log('No Hash data');
                }
            };

            return {
                restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
                link: function (scope, elm, attrs) {
                    var tag = scope.$eval(attrs.vnbLink);
                    if (hashData[tag].is_board) {
                        scope.vnbLinkName = hashData[tag].title;
                    }
                    else {
                        scope.vnbLinkName = hashData[tag].name;
                    }
                    elm.bind('click', function () {
                        go(tag);
                    });
                }
            };
        }]);
})();
