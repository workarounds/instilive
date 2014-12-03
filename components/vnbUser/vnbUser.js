(function () {
    var app = angular.module('vnb.user', []);

    app.directive('vnbUser', [function(){
        return {
            controller: ['$scope', function($scope){
                if($scope.user) {
                    if (!$scope.user.facebook_id) {
                        $scope.user.facebook_id = $scope.user.real_fb_id;
                    }
                }
            }],
            scope: {
                user: "=data"
            },
            restrict: 'E',
            templateUrl: 'components/vnbUser/vnb-user.html'
        };
    }]);
})();
