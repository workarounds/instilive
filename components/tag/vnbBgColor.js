(function () {
    var app = angular.module('Vnb');
    app.directive('vnbBgColor', function () {
        return function (scope, element, attrs) {
            attrs.$observe('vnbBgColor', function (value) {
                element.css({
                    'background-color': 'rgb' + value + '',
                    transition: 'background 0.6s',
                    '-webkit-transition': 'background 0.6s'
                });
            });
        };
    });
})();
