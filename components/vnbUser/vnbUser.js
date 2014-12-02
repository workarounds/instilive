(function () {
    var app = angular.module('vnb.user', []);

    app.directive('vnbUser', [function(){
        return {
            scope: {
                user: "=data"
            },
            restrict: 'E',
            templateUrl: 'components/vnbUser/vnb-user.html'
        };
    }]);
})();
