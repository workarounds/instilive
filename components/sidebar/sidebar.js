(function() {
    var app = angular.module('Vnb');

    app.directive('sidebar', [function() {
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            // scope: {}, // {} = isolate, true = child, false/undefined = no change
            controller: 'SidebarController',
            controllerAs: 'sidebarCtrl',
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
            // template: '<p>{{sidebarCtrl.boards}}</p>',
            templateUrl: 'components/sidebar/sidebar.html',
            // replace: true,
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            //link: function($scope, iElm, iAttrs, controller) {

        };
    }]);
})();