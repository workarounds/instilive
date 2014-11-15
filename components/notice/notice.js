(function() {
    var app = angular.module('Vnb.notice');

    app.directive('notice', [function() {
        return {
            restrict: 'E',
            templateUrl: '/components/notice/notice.html',
            // notice: "=data"
            controller: function(){
                this.type = 'post';
            },
            controllerAs: 'notice'
        };
    }]);
})();