(function() {
    var app = angular.module('vnb.link', []);

    app.directive('vnbLink', ['StateService', '$state',function(StateService, $state) {
        var hashData = false;
        $(document).bind('VNB_HASH_DATA', function(){
            hashData = StateService.getHashData();
        });
        var go = function(tag) {
            if (hashData) {
                if (hashData[tag].is_board) {
                    $state.go('board', {board: tag});
                }
                else if (hashData[tag].board_tag) {
                    $state.go('boardCorner', {
                        board: hashData[tag].board_tag,
                        corner: tag
                    });
                }
                else {
                    console.log('No data found');
                }
            }
            else{
                console.log('No Hash data')
            }
        };

        return {
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            link: function(scope, elm, attrs) {
                var tag = scope.$eval(attrs.vnbLink);
                if(hashData[tag].is_board) {
                    scope.vnbLinkName = hashData[tag].title;
                }
                else{
                    scope.vnbLinkName = hashData[tag].name;
                }
                elm.bind('click', function(){
                    go(tag);
                });
            }
        };
    }]);
})();
