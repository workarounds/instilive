(function() {
    var app = angular.module('vnb.link', []);

    app.directive('vnbLink', [function() {
        // Runs during compile
        return {
            scope: {
                link: "=data"
            },
            restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
            template: '<a href="#/{{link.tag}}">{{link.title}}</a>',
            // link: function($scope, iElm, iAttrs, controller) {

            // }
        };
    }]);
})();