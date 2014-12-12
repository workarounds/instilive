(function () {
    var app = angular.module('Vnb');
    app.directive('backImg', ['$rootScope', function($rootScope){
        return function(scope, element, attrs){
            attrs.$observe('backImg', function(value) {
                element.css({
                    'background-image': 'url(' + value +')',
                    'background-size' : 'cover',
                    'background-position' : 'center'
                });
            });
        };
    }]);
})();
