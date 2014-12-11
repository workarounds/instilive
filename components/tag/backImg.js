(function () {
    var app = angular.module('Vnb');
    app.directive('backImg', ['$rootScope', function($rootScope){
        return function(scope, element, attrs){
            attrs.$observe('backImg', function(value) {
                var image = new Image();
                image.onload =function () {
                    var colorThief = new ColorThief();
                    var color = colorThief.getColor(image);
                    console.log(color);
                };
                image.setAttribute('src', value);
                element.css({
                    'background-image': 'url(' + value +')',
                    'background-size' : 'cover',
                    'background-position' : 'center'
                });
            });
        };
    }]);
})();
